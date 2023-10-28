let zoff = 0;
let particles = [];
let flowfield = [];
let arrow;

function preload() {
  arrow = loadImage('static/arrow-1.svg');
}

function setup() {
  createCanvas(window.innerWidth+100, window.innerHeight+100);
  colorMode(HSB, 360, 255, 255, 100);
//   const numParticles = floor(random(20, 50));
//   for (let i = 0; i < numParticles; i++) {
//     particles.push(new Particle());
//   }
}

function windowResized() {
    resizeCanvas(window.innerWidth+100, window.innerHeight+100);
}

function draw() {
  background('#0D27B2');
  drawPerlinNoiseVectors();
  updateAndShowParticles();
}

function updateAndShowParticles() {
  for (const particle of particles) {
    particle.update();
    particle.show();
  }
}

class Particle {
    constructor() {
        this.pos = createVector(random(width), random(height));
        this.vel = createVector(random(-1, 1), random(-1, 1));
        this.acc = createVector(0, 0);
        this.maxspeed = 2;
        this.h = 0;
        }

        update() {
        this.vel.add(this.acc);
        this.vel.limit(this.maxspeed);
        this.pos.add(this.vel);
        this.acc.mult(0);

        if (this.pos.x > width) this.pos.x = 0;
        if (this.pos.x < 0) this.pos.x = width;
        if (this.pos.y > height) this.pos.y = 0;
        if (this.pos.y < 0) this.pos.y = height;
        }

        applyForce(force) {
        this.acc.add(force);
        }

        show() {
        fill(this.h, 255, 255, 25);
        noStroke();
        ellipse(this.pos.x, this.pos.y, 10, 10);
        this.h = (this.h + 1) % 360;
        }
}

function drawPerlinNoiseVectors() {
  const cols = floor(width / 20);
  const rows = floor(height / 20);
  const scale = 0.1;

  flowfield = new Array(cols * rows);

  let xoff = 0;
  for (let i = 0; i < cols; i++) {
    let yoff = 0;
    for (let j = 0; j < rows; j++) {
      let index = i + j * cols;
      let x = i * 20;
      let y = j * 20;
      let theta = map(noise(xoff, yoff, zoff), 0, 1, 0, TWO_PI);
      let v = p5.Vector.fromAngle(theta);
      v.setMag(1);
      flowfield[index] = v;
      yoff += scale;

      push();
      translate(x, y);
      rotate(v.heading());
      imageMode(CENTER);
      image(arrow, 0, 0, 20, 20);
      pop();
    }
    xoff += scale;
  }

  zoff += 0.01;


  for (const particle of particles) {
    let x = floor(particle.pos.x / 20);
    let y = floor(particle.pos.y / 20);
    let index = x + y * cols;
    let force = flowfield[index];
    particle.applyForce(force);
  }
}

function drawTriangle(length, width) {
  beginShape();
  vertex(0, -width / 2);
  vertex(length, 0);
  vertex(0, width / 2);
  endShape(CLOSE);
}
