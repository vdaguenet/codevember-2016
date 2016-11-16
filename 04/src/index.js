import loop from 'raf-loop';
import dat from 'dat.gui/build/dat.gui.js';
import mouse from './mouse';
import { getWebGLContext, createProgram } from './webgl/utils';
import Triangle from './webgl/Triangle';
import Quad from './webgl/Quad';
import Star from './webgl/Star';

/* ========================================================= *
 * Global
 * ========================================================= */
const $canvas = document.querySelector('canvas');
const params = {
  shape: 'triangle',
  shapesAvailables: ['triangle', 'star', 'quad']
};
let shape;

/* ========================================================= *
 * Main
 * ========================================================= */
onResize();
window.addEventListener('resize', onResize);
document.addEventListener('mousemove', onMouseMove);

// Get context
const gl = getWebGLContext($canvas);
// Bind shaders and create program
const program = createProgram(gl, require('./shaders/point.vert'), require('./shaders/point.frag'));
if (!program) {
  console.error('Failed to create program');
}
gl.useProgram(program);
gl.program = program;

// Setup attributes
const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
if (a_Position < 0) {
  console.error('Failed to locate attribute a_Position');
}

const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
if (a_PointSize < 0) {
  console.error('Failed to locate attribute a_PointSize');
}
gl.vertexAttrib1f(a_PointSize, 15.0);

// Setup uniforms
const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
gl.uniform4f(u_FragColor, 0.0, 1.0, 1.0, 1.0);

selectShape();

// Set clear color
gl.clearColor(0.0, 0.0, 0.0, 1.0);

const engine = loop(update);

const gui = new dat.GUI();
gui.add(params, 'shape', params.shapesAvailables).onChange(selectShape);

engine.start();

/* ========================================================= *
 * Functions
 * ========================================================= */
function onResize() {
  // $canvas.width = window.innerWidth;
  // $canvas.height = window.innerHeight;
  $canvas.width = 400;
  $canvas.height = 400;
}

function onMouseMove(e) {
  mouse.set(e.clientX, e.clientY);
}

function selectShape() {
  switch (params.shape) {
    case 'triangle':
      shape = new Triangle(gl, a_Position);
      break;
    case 'quad':
      shape = new Quad(gl, a_Position);
      break;
    case 'star':
      shape = new Star(gl, a_Position);
      break;
  }
}

function update() {
  // Clear stage
  gl.clear(gl.COLOR_BUFFER_BIT);
  // Draw
  gl.drawArrays(shape.drawMode, 0, shape.verticeCount);
}
