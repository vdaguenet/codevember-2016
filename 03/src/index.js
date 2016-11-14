import loop from 'raf-loop';
import mouse from './mouse';
import { getWebGLContext, createProgram } from './webgl/utils';

const $canvas = document.querySelector('canvas');
const points = [];
const colors = [];

function onResize() {
  $canvas.width = window.innerWidth;
  $canvas.height = window.innerHeight;
}
onResize();

function onMouseMove(e) {
  mouse.set(e.clientX, e.clientY);
  let nMouse = mouse.getNormalizedCoords($canvas.width, $canvas.height);
  points.push([nMouse.x, nMouse.y]);
  colors.push([1.0, 0.0, 0.0, 1.0]);
  if (points.length > 100) {
    points.splice(0, 1);
    colors.splice(0, 1);
  }
  nMouse = null;
}

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

// Bind attributes
gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
gl.vertexAttrib1f(a_PointSize, 15.0);

// Setup uniforms
const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');

// Bind uniforms
gl.uniform4f(u_FragColor, 0.0, 1.0, 1.0, 1.0);

// Set clear color
gl.clearColor(0.0, 0.0, 0.0, 1.0);

function update() {
  // Clear stage
  gl.clear(gl.COLOR_BUFFER_BIT);
  // Draw
  for (let i = 0, l = points.length; i < l; i++) {
    gl.vertexAttrib3f(a_Position, points[i][0], points[i][1], 0.0);
    let ratio = i / l;
    gl.vertexAttrib1f(a_PointSize, ratio * 10.0);
    gl.uniform4f(u_FragColor, colors[i][0], ratio, colors[i][2], colors[i][3]);
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}
const engine = loop(update);

window.addEventListener('resize', onResize);
document.addEventListener('mousemove', onMouseMove);
engine.start();
