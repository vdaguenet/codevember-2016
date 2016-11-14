import ParticleEmitter from './ParticleEmitter';

const $canvas = document.querySelector('canvas');
const emitter = new ParticleEmitter($canvas);

function onResize() {
  $canvas.width = window.innerWidth;
  $canvas.height = window.innerHeight;
  emitter.resize(window.innerWidth, window.innerHeight);
}

onResize();
emitter.populate();
window.addEventListener('resize', onResize);
emitter.start();
