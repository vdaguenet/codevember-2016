import loop from 'raf-loop';
import ControlKit from 'controlkit';
import mat4 from 'gl-mat4';
import vec3 from 'gl-vec3';
import mouse from './mouse';
import Quad from './webgl/shapes/Quad';
import WebglEngine from './webgl/Engine';

/* ========================================================= *
 * Global
 * ========================================================= */
const $canvas = document.querySelector('canvas');
const params = {
  shape: 'quad',
  shapesAvailables: ['quad'],
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
  rRange: [-Math.PI, Math.PI],
  blendMode: 'multiply',
  blendModeAvailables: ['multiply', 'additive', 'substract', 'divide']
};
const engine = loop(update);
let transformMatrix = mat4.identity([]);
let shape;
let imgLoadedCount = 0;

/* ========================================================= *
 * Main
 * ========================================================= */
onResize();
window.addEventListener('resize', onResize);
document.addEventListener('mousemove', onMouseMove);

const webgl = new WebglEngine($canvas);
webgl.initContext();
webgl.initProgram();
webgl.bindAttributes(['a_Position', 'a_TexCoord']);
webgl.bindUniforms(['u_TransformMatrix', 'u_Sampler0', 'u_Sampler1', 'u_BlendMode']);
setTransformMatrix();
webgl.gl.uniformMatrix4fv(webgl.uniforms['u_TransformMatrix'], false, transformMatrix);
selectBlendMode();

const texture0 = webgl.gl.createTexture();
const texture1 = webgl.gl.createTexture();

let image0 = new Image();
image0.onload = () => { loadTexture(image0, texture0, 'u_Sampler0', 0); };
image0.src = './assets/redflower.jpg';
let image1 = new Image();
image1.onload = () => { loadTexture(image1, texture1, 'u_Sampler1', 1); };
image1.src = './assets/circle.gif';

selectShape();
initGUI();

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
    case 'quad':
      shape = new Quad(webgl.gl, webgl.attributes['a_Position'], webgl.attributes['a_TexCoord']);
      break;
  }
}

function selectBlendMode() {
  switch (params.blendMode) {
    case 'multiply':
      webgl.gl.uniform1i(webgl.uniforms['u_BlendMode'], 0);
      break;
    case 'additive':
      webgl.gl.uniform1i(webgl.uniforms['u_BlendMode'], 1);
      break;
    case 'substract':
      webgl.gl.uniform1i(webgl.uniforms['u_BlendMode'], 2);
      break;
    case 'divide':
      webgl.gl.uniform1i(webgl.uniforms['u_BlendMode'], 3);
      break;
  }
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
  webgl.gl.uniformMatrix4fv(webgl.uniforms['u_TransformMatrix'], false, transformMatrix);
  // Draw
  webgl.gl.drawArrays(shape.drawMode, 0, shape.verticeCount);
}

function loadTexture(img, tex, uniform, i) {
  webgl.loadTexture(tex, img, uniform, i);

  imgLoadedCount++;
  if (imgLoadedCount === 2) {
    engine.start();
  }
}

function initGUI() {
  const gui = new ControlKit();
  gui.addPanel()
    // .addSelect(params, 'shapesAvailables', {
    //   target: 'shape',
    //   onChange: selectShape
    // })
    .addSelect(params, 'blendModeAvailables', {
      target: 'blendMode',
      onChange: selectBlendMode
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
      .addSlider(params, 'rx', 'rRange')
      .addSlider(params, 'ry', 'rRange')
      .addSlider(params, 'rz', 'rRange');
}
