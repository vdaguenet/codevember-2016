var $canvas = document.querySelector('canvas');
var ctx = $canvas.getContext('2d');
var NB_PARTICLE = 250;
var particles = [];
var old_particles = [];
var max_distances = [];
var velocities = [];
var mouse = [0, 0];

function onResize() {
  $canvas.width = window.innerWidth;
  $canvas.height = window.innerHeight;
}

function onMouseMove(e) {
  mouse[0] = e.clientX;
  mouse[1] = e.clientY;
}

function dist(a, b) {
  return Math.hypot(b[0] - a[0], b[1] - a[1]);
}

function populate() {
  for (var i = 0; i < NB_PARTICLE; i++) {
    particles.push([
      Math.random() * $canvas.width,
      Math.random() * $canvas.height
    ]);
    old_particles[i] = [];
    old_particles[i][0] = particles[i][0];
    old_particles[i][1] = particles[i][1];
    velocities.push([
      Math.random() * 2,
      Math.random() * 2
    ]);
    max_distances.push(Math.random() * 100 + 50);
  }
}

function updateParticle(p, i) {
  if (dist(old_particles[i], p) > max_distances[i]) {
    velocities[i][0] *= -1;
    velocities[i][1] *= -1;
  }
  p[0] += velocities[i][0];
  p[1] += velocities[i][1];
}

function checkDistInParticles(p) {
  for (var i = 0; i < NB_PARTICLE; i++) {
    if (dist(p, particles[i]) < 60) {
      ctx.globalAlpha = 0.2;
      ctx.beginPath();
      ctx.moveTo(particles[i][0], particles[i][1]);
      ctx.lineTo(p[0], p[1]);
      ctx.closePath();
      ctx.stroke();
    }
  }
}

function update() {
  ctx.clearRect(0, 0, $canvas.width, $canvas.height);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, $canvas.width, $canvas.height);
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#fff';
  for (var i = 0; i < NB_PARTICLE; i++) {
    var p = particles[i];

    // udpate
    updateParticle(p, i);

    // check dist
    checkDistInParticles(p);
    if (dist(mouse, p) < 100) {
      ctx.globalAlpha = 0.2;
      ctx.beginPath();
      ctx.moveTo(mouse[0], mouse[1]);
      ctx.lineTo(p[0], p[1]);
      ctx.closePath();
      ctx.stroke();
    }

    // draw
    ctx.globalAlpha = 1.0;
    ctx.beginPath();
    ctx.arc(p[0], p[1], 1, 0, 2 * Math.PI, false);
    ctx.fill();
  }

  window.requestAnimationFrame(update);
}

onResize();
populate();
window.addEventListener('resize', onResize);
document.addEventListener('mousemove', onMouseMove);
window.requestAnimationFrame(update);
