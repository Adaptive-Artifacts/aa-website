let zoff = 0;
let flowfield = [];
let arrow;
const resolution = 36;

function preload() {
  arrow = loadImage('static/arrow-1.svg');
}

function setup() {
  createCanvas(window.innerWidth+100, window.innerHeight+100);
  colorMode(HSB, 360, 255, 255, 100);
  initFlowField();
}

function draw() {
  background('#0D27B2');
  drawPerlinNoiseVectors();
}

function windowResized() {
  resizeCanvas(window.innerWidth+100, window.innerHeight+100);
  initFlowField(); // Reinitialize the flow field when the window is resized
}

function initFlowField() {
  const cols = floor(width / resolution);
  const rows = floor(height / resolution);
  flowfield = new Array(cols * rows);
}

function drawPerlinNoiseVectors() {
  const cols = floor(width / resolution);
  const rows = floor(height / resolution);
  const scale = 0.1;

  let xoff = 0;
  for (let i = 0; i < cols; i++) {
    let yoff = 0;
    for (let j = 0; j < rows; j++) {
      const index = i + j * cols;
      const x = i * resolution;
      const y = j * resolution;
      const theta = map(noise(xoff, yoff, zoff), 0, 1, 0, TWO_PI);
      const v = p5.Vector.fromAngle(theta);
      v.setMag(1);
      flowfield[index] = v;
      yoff += scale;

      drawArrow(x, y, v);
    }
    xoff += scale;
  }
  zoff += 0.01;
}

function drawArrow(x, y, v) {
  push();
  translate(x, y);
  rotate(v.heading());
  imageMode(CENTER);
  image(arrow, 0, 0, resolution, resolution);
  pop();
}
