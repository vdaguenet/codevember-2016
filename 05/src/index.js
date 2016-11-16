import loop from 'raf-loop';
import ControlKit from 'controlkit';
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
  shapesAvailables: ['triangle', 'star', 'quad'],
  tx: 0.0,
  ty: 0.0,
  tz: 0.0,
  tRange: [-1, 1],
  sx: 1.0,
  sy: 1.0,
  sz: 1.0,
  sRange: [0, 5],
  alpha: 0.0,
  rRange: [-Math.PI, Math.PI]
};
let shape;
let transfomrMatrix;

/* ========================================================= *
 * Main
 * ========================================================= */
onResize();
window.addEventListener('resize', onResize);
document.addEventListener('mousemove', onMouseMove);

// Get context
const gl = getWebGLContext($canvas);
// Bind shaders and create program
const program = createProgram(gl, require('./shaders/main.vert'), require('./shaders/main.frag'));
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
const u_TransformMatrix = gl.getUniformLocation(gl.program, 'u_TransformMatrix');
setTransformMatrix();
gl.uniformMatrix4fv(u_TransformMatrix, false, transfomrMatrix);

selectShape();

// Set clear color
gl.clearColor(0.0, 0.0, 0.0, 1.0);

const engine = loop(update);

const gui = new ControlKit();
gui.addPanel()
  .addSelect(params, 'shapesAvailables', {
    target: 'shape',
    onChange: selectShape
  })
  .addGroup({ label: 'Translation' })
    .addSlider(params, 'tx', 'tRange')
    .addSlider(params, 'ty', 'tRange')
    .addSlider(params, 'tz', 'tRange')
  .addGroup({ label: 'Scale' })
    .addSlider(params, 'sx', 'sRange')
    .addSlider(params, 'sy', 'sRange')
    .addSlider(params, 'sz', 'sRange')
  .addGroup({ label: 'Rotation' })
    .addSlider(params, 'alpha', 'rRange');

engine.start();

/* ========================================================= *
 * Functions
 * ========================================================= */
function onResize() {
  $canvas.width = window.innerHeight;
  $canvas.height = window.innerHeight;
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

function setTransformMatrix() {
  transfomrMatrix = new Float32Array([
    params.sx * Math.cos(params.alpha), Math.sin(params.alpha), 0.0, 0.0,
    -Math.sin(params.alpha), params.sy * Math.cos(params.alpha), 0.0, 0.0,
    0.0, 0.0, params.sz, 0.0,
    params.tx, params.ty, params.tz, 1.0
  ]);
}

function update() {
  // Clear stage
  gl.clear(gl.COLOR_BUFFER_BIT);
  // Update
  setTransformMatrix();
  gl.uniformMatrix4fv(u_TransformMatrix, false, transfomrMatrix);
  // Draw
  gl.drawArrays(shape.drawMode, 0, shape.verticeCount);
}
