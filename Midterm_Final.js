// REFERENCES
// https://github.com/saikatbsk/RacingMania
// Red Line Rumble: https://www.youtube.com/watch?v=XzJq_ByZfJk
// https://p5js.org/reference/
//  ---- https://p5js.org/examples/games-snake/
//  ---- https://p5js.org/tutorials/responding-to-inputs/
// Human Assistance: Keasean Souffrant

let cards = []; // Holds the level select cards shown on the menu
let state = 'menu'; // Tracks whether the game is in menu, play, win, or lose mode
let lanes = 3; // Stores how many road lanes the current level uses
let copsOn = false; // Turns cop spawning on or off for the level
let trafficLevel = 3; // Controls how much regular traffic appears
let raceEnd = 3200; // Sets how far the player must travel to win
let playerSpeed = 5; // Sets the forward speed of the race
let playerLane = 1; // Stores the lane index the player is in
let playerHits = 0; // Counts how many times the player has crashed
let maxHits = 3; // Sets the number of hits allowed before losing
let distanceTravelled = 0; // Tracks race progress toward the finish
let laneCooldown = 0; // Delays repeated lane changes while a key is held
let spawnTimer = 0; // Counts down until the next traffic wave
let stripesOffset = 0; // Animates the road stripe movement
let lastOpenLane = -1; // Remembers the last safe lane left open
let traffic = []; // Holds every active traffic and cop car on screen

const roadMargin = 140; // Sets the left and right road edge space
const roadTop = 90; // Sets where the road begins at the top
const roadBottom = 120; // Sets where the road ends above the bottom
const playerSize = 52; // Sets the player circle size
const civilianSize = 40; // Sets the regular traffic circle size
const copSize = 46; // Sets the cop circle size
const levels = [
  { label: 'Easy', lanes: 3, cops: false, traffic: 3, finish: 3000 },
  { label: 'Medium', lanes: 5, cops: true, traffic: 5, finish: 4000 },
  { label: 'Hard', lanes: 7, cops: true, traffic: 40, finish: 5000 },
];

// Creates the canvas and prepares the menu cards
function setup() {
  createCanvas(1280, 720);
  textFont('Helvetica');
  buildCards();
}

// Main p5 draw loop that switches between menu and game screens
function draw() {
  updateGame();
  
  if (state === 'menu') {
    drawMenu();
  } else {
    drawBackground();
    drawRoad();
    drawHud();
    drawCars();
    if (state === 'win') {
      drawOverlay('You Win', 'Finish line reached.');
    }
    if (state === 'lose') {
      drawOverlay('Race Failed', 'Three hits.');
    }
  }
}

// Draws the start menu and all difficulty cards
function drawMenu() {
  drawBackground();
  fill(245);
  stroke(0);
  rect(40, 32, width - 80, height - 64);
  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(42);
  text('Lane Racer Demo', width / 2, 98);
  textSize(20);
  text('Arrow keys move. Avoid traffic and cops. Reach the end before 3 hits.', width / 2, 160);
  text('By Keavan Souffrant', width / 2, 200);
  

  for (let i = 0; i < cards.length; i += 1) {
    const card = cards[i];
    let cardShade = 235;
    if (mouseX >= card.x && mouseX <= card.x + card.w && mouseY >= card.y && mouseY <= card.y + card.h) {
      cardShade = 220;
    }

    let copsLabel = 'Cops: Off';
    if (card.cops) {
      copsLabel = 'Cops: On';
    }

    fill(cardShade);
    stroke(0);
    rect(card.x, card.y, card.w, card.h);
    noStroke();
    fill(0);
    textSize(28);
    text(card.label, card.x + card.w / 2, card.y + 48);
    textSize(18);
    text('Lanes: ' + card.lanes, card.x + card.w / 2, card.y + 98);
    text('Traffic: ' + card.traffic, card.x + card.w / 2, card.y + 130);
    text(copsLabel, card.x + card.w / 2, card.y + 162);
    text('Finish: ' + card.finish, card.x + card.w / 2, card.y + 194);
    stroke(0);
    fill(200);
    rect(card.x + 34, card.y + card.h - 30, card.w - 68, 36);
    noStroke();
    fill(0);
    text('Click To Race', card.x + card.w / 2 , card.y + card.h - 12);
  }
}

// Builds the clickable menu cards for each difficulty
function buildCards() {
  const w = 320;
  const h = 250;
  const gap = 40;
  const startX = (width - (w * 3 + gap * 2)) / 2;
  cards = [];
  
  for (let i = 0; i < levels.length; i += 1) {
    cards.push({ ...levels[i], x: startX + i * (w + gap), y: 270, w, h });
  }
}

// Resets the race state using the selected level settings
function resetRace(level) {
  lanes = max(3, level.lanes);
  copsOn = level.cops;
  trafficLevel = level.traffic;
  playerSpeed = 5 + floor(level.traffic / 4);

  if (trafficLevel < 1) {
    trafficLevel = 1;
  }

  if (trafficLevel > 10) {
    trafficLevel = 10;
  }

  raceEnd = max(2000, level.finish);
  playerLane = floor(lanes / 2);
  playerHits = 0;
  distanceTravelled = 0;
  laneCooldown = 0;
  spawnTimer = 0;
  stripesOffset = 0;
  lastOpenLane = -1;
  traffic = [];
  state = 'play';
}

// Updates movement, spawning, collisions, and win or lose state
function updateGame() {
  // Only run the game update while the race is active.
  if (state === 'play') {
    // Move the race forward, animate the road, and tick the spawn timer down
    distanceTravelled += playerSpeed;
    stripesOffset = (stripesOffset + playerSpeed * 3) % 80;
    spawnTimer -= 1;

    // Count down the lane change delay while it is active
    if (laneCooldown > 0) {
      laneCooldown -= 1;
    }

    // When the spawn timer reaches zero, create a new wave and reset the timer
    if (spawnTimer <= 0) {
      spawnWave();
      spawnTimer = max(7, 32 - trafficLevel * 2);
    }

    // Only allow lane movement when the player is not on cooldown
    if (laneCooldown <= 0) {
      // Move one lane left if the left arrow is being held
      if (keyIsDown(LEFT_ARROW)) {
        playerLane -= 1;

        // stop the player from going off the road
        if (playerLane < 0) {
          playerLane = 0;
        }

        // Add a short delay so one key press does not skip many lanes
        laneCooldown = 10;
      }

      // Move one lane right if the right arrow is being held
      if (keyIsDown(RIGHT_ARROW)) {
        playerLane += 1;

        // stop the player from going off the road of last lane
        if (playerLane > lanes - 1) {
          playerLane = lanes - 1;
        }

        // Restart the lane change cooldown after moving
        laneCooldown = 10;
      }
    }

    // Loop through traffic so cars can be removed at end of map or on crash
    for (let i = traffic.length - 1; i >= 0; i -= 1) {
      const car = traffic[i];

      // Every frame, move the car farther down the road
      car.y += car.speed;

      // Civilian cars stay centered, while cops drift sideways into the lane
      if (car.type === 'cop') {
        car.x = car.x + ((laneCenter(car.lane) - laneWidth() * 0.22) - car.x) * 0.08;
      } else {
        car.x = laneCenter(car.lane);
      }

      // If this car hits the player, remove it and count the crash
      if (hitCar(car)) {
        traffic.splice(i, 1);
        playerHits += 1;

        // End the race once the player has taken too many hits
        if (playerHits >= maxHits) {
          state = 'lose';
        }

      // Otherwise, remove cars once they leave the bottom of the screen
      } else if (car.y > height + 120) {
        traffic.splice(i, 1);
      }
    }

    // Win the race once the player has traveled far enough
    if (distanceTravelled >= raceEnd) {
      state = 'win';
    }
  }
}

// Draws the simple background above and below the road
function drawBackground() {
  background(210);
  noStroke();
  fill(170);
  rect(0, 0, width, roadTop);
  rect(0, height - roadBottom, width, roadBottom);
}

// Draws the road, lane lines, and moving yellow stripes
function drawRoad() {
  fill(70);
  rect(roadMargin, roadTop, width - roadMargin * 2, height - roadTop - roadBottom);
  stroke(255);
  strokeWeight(2);
  
  for (let i = 1; i < lanes; i += 1) {
    line(roadMargin + laneWidth() * i, roadTop, roadMargin + laneWidth() * i, height - roadBottom);
  }

  stroke(255, 255, 0);
  strokeWeight(6);
  for (let i = 1; i < lanes; i += 1) {
    const x = roadMargin + laneWidth() * i;
    for (let y = roadTop - 60 + stripesOffset; y < height - roadBottom; y += 80) {
      line(x, y, x, y + 34);
    }
  }
}

// Draws the title, distance, lives, and progress bar
function drawHud() {
  let progress = distanceTravelled / raceEnd;
  if (progress > 1) {
    progress = 1;
  }
  const lives = maxHits - playerHits;
  fill(255);
  stroke(0);
  rect(20, 20, 300, 90);
  noStroke();
  fill(0);
  textAlign(LEFT, CENTER);
  textSize(20);
  text('Lane Racer', 36, 44);
  textSize(16);
  text('Distance: ' + floor(distanceTravelled) + ' / ' + raceEnd, 36, 72);
  text('Lives: ' + lives, 36, 94);
  fill(255);
  stroke(0);
  rect(width - 280, 24, 240, 24);
  noStroke();
  fill(0);
  rect(width - 280, 24, 240 * progress, 24);
}

// Draws all enemy cars and the player car
function drawCars() {
  noStroke();
  for (let i = 0; i < traffic.length; i += 1) {
    const car = traffic[i];
    let carColor = color(230, 150, 40);
    let carSize = car.size;

    if (car.type === 'cop') {
      carColor = color(50, 90, 180);
      carSize = car.size + 12;
    }

    fill(carColor);
    circle(car.x, car.y, carSize);
  }
  fill(220, 60, 90);
  circle(laneCenter(playerLane), playerY(), playerSize);
}

// Draws the full-screen win or lose message
function drawOverlay(title, sub) {
  fill(255, 255, 255, 220);
  rect(0, 0, width, height);
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(48);
  text(title, width / 2, height / 2 - 30);
  textSize(24);
  text(sub, width / 2, height / 2 + 24);
  textSize(18);
  text('Press R to return to the level select screen.', width / 2, height / 2 + 64);
}

// Picks one lane to stay more open during the next traffic wave
function openLane() {
  let lane = floor(random(lanes));
  if (lanes > 1 && lane === lastOpenLane) {
    lane = (lane + 1 + floor(random(lanes - 1))) % lanes;
  }
  lastOpenLane = lane;
  return lane;
}

// Checks whether a new car can safely spawn in a lane
function canSpawn(lane, type) {
  for (let i = 0; i < traffic.length; i += 1) {
    const car = traffic[i];
    if (car.lane === lane) {
      if (car.y < 180) {
        return false;
      }
      if (type === 'traffic' && car.type === 'traffic' && car.y < 260) {
        return false;
      }
      if (type === 'cop' && car.type === 'traffic' && car.y < 260) {
        return false;
      }
    }
  }
  return true;
}

// Adds one new traffic or cop car if a valid lane is available
function spawnOne(type, blockedLane) {
  const order = shuffle([...Array(lanes).keys()]);
  for (let i = 0; i < order.length; i += 1) {
    const lane = order[i];
    if (lane !== blockedLane && canSpawn(lane, type)) {
      let x = laneCenter(lane);
      let speed = playerSpeed + 3 + trafficLevel * 0.2;
      let size = civilianSize;

      if (type === 'cop') {
        x = laneCenter(lane) - laneWidth() * 0.5;
        speed = playerSpeed + 4 + trafficLevel * 0.25;
        size = copSize;
      }

      traffic.push({
        lane,
        type,
        x,
        y: -80,
        speed,
        size,
      });
      return true;
    }
  }

  return false;
}

// Spawns a full wave of civilian traffic and sometimes a cop car
function spawnWave() {
  const blockedLane = openLane();
  const civilians = min(max(1, floor(trafficLevel / 3) + 1), lanes - 1);
  
  for (let i = 0; i < civilians; i += 1) {
    spawnOne('traffic', blockedLane);
  }

  if (copsOn && random() < 0.3) {
    spawnOne('cop', -1);
  }
}

// Checks whether a traffic car has hit the player
function hitCar(car) {
  return abs(car.x - laneCenter(playerLane)) < 42 && abs(car.y - playerY()) < 42;
}

// Returns the width of one driving lane
function laneWidth() { 
  return (width - roadMargin * 2) / lanes; 
}

// Returns the x position for the center of a lane
function laneCenter(i) { 
  return roadMargin + laneWidth() * i + laneWidth() / 2; 
}

// Returns the fixed y position for the player's car
function playerY() { 
  return height - 150; 
}

// Lets the player return to the menu after a race ends
function keyPressed() {
  if ((state === 'win' || state === 'lose') && (key === 'r' || key === 'R')) {
    state = 'menu';
  }
}

// Starts a race when the user clicks one of the level cards
function mousePressed() {
  if (state === 'menu') {
    let cardChosen = false;
    for (let i = 0; i < cards.length && cardChosen === false; i += 1) {
      const card = cards[i];
      if (mouseX >= card.x && mouseX <= card.x + card.w && mouseY >= card.y && mouseY <= card.y + card.h) {
        resetRace(card);
        cardChosen = true;
      }
    }
  }
}