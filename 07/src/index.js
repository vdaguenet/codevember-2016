import loop from 'raf-loop';
import ControlKit from 'controlkit';
import mat4 from 'gl-mat4';
import vec3 from 'gl-vec3';
import mouse from './mouse';
import MultiTriangles from './webgl/shapes/MultiTriangles';
import WebglEngine from './webgl/Engine';
import Camera from './webgl/Camera';

/* ========================================================= *
 * Global
 * ========================================================= */
const $canvas = document.querySelector('canvas');
const params = {
  tx: 0.0,
  ty: 0.0,
  tz: 0.0,
  tRange: [-1, 1],
  sx: 1.0,
  sy: 1.0,
  sz: 1.0,
  sRange: [0, 5],
  rx: 0.0,
  ry: 0.0,
  rz: 0.0,
  rRange: [-Math.PI, Math.PI]
};
const engine = loop(update);
let transformMatrix = mat4.identity([]);
let shape;

/* ========================================================= *
 * Main
 * ========================================================= */
onResize();
window.addEventListener('resize', onResize);
document.addEventListener('mousemove', onMouseMove);

const camera = new Camera();
camera.setEye(0.2, 0.25, 0.25);
camera.setLookAt(0, 0, 0);
camera.setUp(0, 1, 0);

const webgl = new WebglEngine($canvas);
webgl.initContext();
webgl.initProgram();
webgl.bindAttributes(['a_Position', 'a_Color']);
webgl.bindUniforms(['u_ViewMatrix', 'u_TransformMatrix']);
webgl.gl.uniformMatrix4fv(webgl.uniforms['u_ViewMatrix'], false, camera.getViewMatrix());
setTransformMatrix();
webgl.gl.uniformMatrix4fv(webgl.uniforms['u_TransformMatrix'], false, transformMatrix);

shape = new MultiTriangles(webgl.gl, webgl.attributes['a_Position'], webgl.attributes['a_Color']);

// initGUI();
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
  const nMouse = mouse.getNormalizedCoords($canvas.width, $canvas.height);
  camera.setEye(nMouse.x, nMouse.y, 0.25);
}

function setTransformMatrix() {
  let out = [];
  mat4.rotateX(out, mat4.identity([]), params.rx);
  mat4.rotateY(out, out, params.ry);
  mat4.rotateZ(out, out, params.rz);
  mat4.scale(out, out, vec3.set([], params.sx, params.sy, params.sz));
  mat4.translate(out, out, vec3.set([], params.tx, params.ty, params.tz));

  transformMatrix = out;
}

function update() {
  // Clear stage
  webgl.clear();
  // Update
  setTransformMatrix();
  webgl.gl.uniformMatrix4fv(webgl.uniforms['u_ViewMatrix'], false, camera.getViewMatrix());
  webgl.gl.uniformMatrix4fv(webgl.uniforms['u_TransformMatrix'], false, transformMatrix);
  // Draw
  webgl.gl.drawArrays(shape.drawMode, 0, shape.verticeCount);
}

function initGUI() {
  const gui = new ControlKit();
  gui.addPanel()
    .addGroup({ label: 'Translation' })
      .addSlider(params, 'tx', 'tRange')
      .addSlider(params, 'ty', 'tRange')
      .addSlider(params, 'tz', 'tRange')
    .addGroup({ label: 'Scale' })
      .addSlider(params, 'sx', 'sRange')
      .addSlider(params, 'sy', 'sRange')
      .addSlider(params, 'sz', 'sRange')
    .addGroup({ label: 'Rotation' })
      .addSlider(params, 'rx', 'rRange')
      .addSlider(params, 'ry', 'rRange')
      .addSlider(params, 'rz', 'rRange');
}
