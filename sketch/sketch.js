function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100, 100);
  strokeWeight(4);
}

function draw() {
  background(0,0,95);

  showMousePosition();
  displayMouseVal();
  // fillColour();
  drawAxes();
 
  
}

function drawAxes() {
  strokeWeight(2);
  stroke(2);
  line(0,height/2, width, height/2);
  line(width/2,0, width/2, height);
  
}

function showMousePosition() {
  let valenceX = (2*mouseX/width)-1;
  let arousalY = (2*mouseY/height)-1;

  if (mouseIsPressed) {
       console.log(valenceX, arousalY);
  }
}

function fillColour() {
  
  let cx = width / 2;
  let cy = height / 2;
  let offset = width / 15;
  let w = width;  
  let h = height; 
  
  //translate to begin in centre of axes
  push();
  translate(cx, cy);
  rectMode(CENTER);
  
  
  let p1 = createVector(w/2, -h/2);
  let p2 = createVector(w/2, h/2);
  let p3 = createVector(-w/2, h/2);
  let p4 = createVector(-w/2, -h/2);
  

  let points = [p1, p2, p3, p4];

  let c1 = color(360 / 4 * 1, 100, 100);
  let c2 = color(360 / 4 * 2, 100, 100);
  let c3 = color(360 / 4 * 3, 100, 100);
  let c4 = color(360 / 4 * 4, 100, 100);
  let colors = [c1, c2, c3, c4];

  let i = 0;
  let pA1 = points[i];
  let pA2 = points[(i + 1)];
  let pB1 = points[i + 2];
  let pB2 = points[(i + 3)];

  let cA1 = colors[i];
  let cA2 = colors[(i + 1)];
  let cB1 = colors[i + 2];
  let cB2 = colors[(i + 3)];
  
  colorMode(RGB);
  for (let j = 0; j < 1; j += 1 / 400) {
    let pA = p5.Vector.lerp(pA1, pA2, j);
    let cA = lerpColor(cA1, cA2, j);
    let pB = p5.Vector.lerp(pB1, pB2, 1 - j);
    let cB = lerpColor(cB1, cB2, 1 - j);
    for(let k = 0; k < 1; k += 1/200){
      let c = lerpColor(cA,cB,k); 
      let p = p5.Vector.lerp(pA,pB,k);
      let pp = p5.Vector.lerp(pA,pB,constrain(k+1/100,0,1));
      stroke(c);
      strokeWeight(3);
      line(p.x,p.y,pp.x,pp.y);
    }
  }
  pop();
  noLoop();

}

function displayMouseVal() {

  let valenceX = (2*mouseX/width)-1;
  let arousalY = (2*mouseY/height)-1;
  
  var valenceText = document.getElementById("val");
  valenceText.innerHTML = valenceX;
  var arousalText = document.getElementById("arous");
  arousalText.innerHTML = arousalY;

document.addEventListener('click', displayMouseVal);

}




