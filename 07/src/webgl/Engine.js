import { getWebGLContext, createProgram } from './utils';

export default class Engine {
  constructor($canvas) {
    this.$canvas = $canvas;
    this.attributes = {};
    this.uniforms = {};
  }

  initContext() {
    this.gl = getWebGLContext(this.$canvas);
    // Set clear color
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
  }

  initProgram() {
    this.program = createProgram(this.gl, require('../shaders/main.vert'), require('../shaders/main.frag'));
    if (!this.program) {
      console.error('Failed to create program');
    }
    this.gl.useProgram(this.program);
    this.gl.program = this.program;
  }

  bindAttributes(attributes) {
    attributes.forEach((attribute) => {
      const ref = this.gl.getAttribLocation(this.gl.program, attribute);
      if (ref < 0) {
        console.error('Failed to locate attribute: ' + attribute);
        return;
      }
      this.attributes[attribute] = ref;
    });
  }

  bindUniforms(uniforms) {
    uniforms.forEach((uniform) => {
      const ref = this.gl.getUniformLocation(this.gl.program, uniform);
      if (ref < 0) {
        console.error('Failed to locate uniform: ' + uniform);
        return;
      }
      this.uniforms[uniform] = ref;
    });
  }

  clear() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  loadTexture(texture, image, uniform, unit) {
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 1);
    if (unit === 0) {
      this.gl.activeTexture(this.gl.TEXTURE0);
    } else if (unit === 1) {
      this.gl.activeTexture(this.gl.TEXTURE1);
    }
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGB, this.gl.RGB, this.gl.UNSIGNED_BYTE, image);
    this.gl.uniform1i(this.uniforms[uniform], unit);
  }
}
