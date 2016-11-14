import Particle from './Particle';
import loop from 'raf-loop';
import bindAll from 'lodash.bindall';

export default class ParticleEmitter {
  constructor($canvas) {
    bindAll(this, 'update');
    this.ctx = $canvas.getContext('2d');
    this.width = $canvas.width;
    this.height = $canvas.height;
    this.isStarted = false;

    this.particleCount = 1000;
    this.particles = [];

    this.engine = loop(this.update);
  }

  resize(w, h) {
    this.width = w;
    this.height = h;
  }

  populate() {
    for (let i = 0; i < this.particleCount; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      this.particles.push(new Particle(x, y));
    }
  }

  start() {
    if (this.isStarted) return;

    this.engine.start();
    this.isStarted = true;
  }

  stop() {
    if (!this.isStarted) return;

    this.engine.stop();
    this.isStarted = false;
  }

  update() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    for (let i = 0; i < this.particleCount; i++) {
      this.particles[i].update(this.height * 1.25);
      if (this.particles[i].position.y > this.height) {
        this.particles[i].reset(Math.random() * this.width, 0);
      }
      this.particles[i].draw(this.ctx);
    }
  }
}
