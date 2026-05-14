// Keavan S
// The Forest
// The theme of this piece and future arts will be based on the climate changes made in nature



let yellow = '#f6ee00'
let nightMode = false;

function random() {
  
}

random();

function setup() {
  createCanvas(1920, 1080);
}

function draw() {
  
  if (nightMode) {
    background('#032427');
  } else {
    background('#00c2d4');
  }

  strokeWeight(2);
  // Sun
  fill (yellow);
  circle(1500, 110, 210);
  strokeWeight(1);
 
  fill('#786105');
  rect(0, 800, 1920, 1080);

  fill('#2b7805');
  rect(0, 850, 820, 1080);

  fill('#2b7805');
  rect(1100, 850, 820, 1080);

 

  stroke('#000000');
  line(1850, 850, 30, 850);

  stroke('#000000');
  line(1850, 950, 30, 950);

  stroke('#000000');
  line(1850, 900, 30, 900);

  

  fill('#714015');
  rect(250, 400, 80, 400, );

  // x1, y1, x2, y2, x3, y3
  fill('#133403');
  triangle(220, 400, 290, 400, 250, 30);

  fill('#133403');
  triangle(420, 400, 290, 400, 250, 60);

  fill('#133403');
  triangle(20, 260, 100, 120, 180, 260);

  fill('#714015');
  rect(80, 258, 40, 600, );

  fill('#133403');
  triangle(40, 520, 200, 240, 360, 520);

  fill('#714015');
  rect(150, 520, 60, 300, );

  fill('#714015');
  rect(520, 300, 60, 520, );

  fill('#133403');
  circle(550, 300, 200);

  fill('#714015');
  rect(400, 600, 40, 200, );

  fill('#133403');
  circle(420, 600, 150);

  fill('#714015');
  rect(700, 400, 60, 400, );

  fill('#133403');
  triangle(670, 400, 770, 400, 720, 30);

    fill('#133403');  
  triangle(870, 400, 770, 400, 720, 60);
  
  fill('#714015');
  rect(640, 720, 20, 100, );

  fill('#133403');
  triangle(620, 780, 680, 780, 650, 500);

  fill('#714015');
  rect(1200, 400, 60, 400, );

  fill('#133403');
  triangle(1170, 400, 1270, 400, 1220, 30);

    fill('#133403');  
  triangle(1370, 400, 1270, 400, 1220, 60);

  fill('#714015');
  rect(1110, 720, 20, 100, );
  
  fill('#133403');
  triangle(1090, 780, 1150, 780, 1120, 500);

  fill('#714015');
  rect(1500, 400, 60, 400, );

  fill('#133403');
  triangle(1470, 400, 1570, 400, 1520, 30);

    fill('#133403');  
  triangle(1670, 400, 1570, 400, 1520, 60);

    fill('#714015');
    rect(1460, 720, 20, 100, );

  fill('#133403');
  triangle(1440, 780, 1500, 780, 1470, 500);

  fill('#714015');
  rect(1800, 400, 60, 400, );
  
  fill('#133403');
  triangle(1770, 400, 1870, 400, 1820, 30);

    fill('#133403');  
  triangle(1970, 400, 1870, 400, 1820, 60);
  
    fill('#714015');
    rect(1760, 720, 20, 100, );

  fill('#133403');
  triangle(1740, 780, 1800, 780, 1770, 500);

  fill('#000000');
  rect(850, 700, 5, 100, );

  fill('#000000');
  circle(853, 700, 60);

  fill('#000000');
  rect(900, 750, 5, 50, );
  
  fill('#000000');
  circle(903, 750, 25);

  fill('#000000');
  rect(800, 750, 5, 50, );

  fill('#000000');
  circle(803, 750, 25); 

  fill('#000000');
  rect(940, 770, 5, 30, );

  fill('#000000');
  circle(943, 770, 15);

  fill('#000000');
  rect(970, 780, 5, 20, );

  fill('#000000');
  circle(973, 780, 10);

  fill('#000000');
  rect(1000, 740, 5, 60, );

  fill('#000000');
  circle(1003, 740, 40);

  fill('#000000');
  rect(1050, 700, 5, 100, );

  fill('#000000');
  circle(1053, 700, 60);

  fill('#000000');
  rect(1300, 750, 5, 50, );

  fill('#000000');
  circle(1303, 750, 25);

  fill('#000000');
  rect(1350, 730, 5, 70, );

  fill('#000000');
  circle(1353, 730, 35);

  fill('#000000');
  rect(1390, 750, 5, 50, );

  fill('#000000');
  circle(1393, 750, 25);

  fill('#714015');
  rect(1640, 600, 30, 200, );

  fill('#133403');
  circle(1655, 600, 110);

  // Night mode
  if (nightMode) {
    fill(0, 0, 0, frameCount * .5);
    rect(0, 0, 1920, 1080);
  } else {
    frameCount = 0; 
  }



    







  


  
  







  

  
}
function mousePressed() {
  if (dist(mouseX, mouseY, 1500, 110) < 105) {
    nightMode = !nightMode;
  }
}

//714015 Tree Bark
//000000 Distant Tree
//133403 Green Tree
//f6ee00 Yellow Sun
//786105 Brown Ground
//00c2d4 Blue Sky