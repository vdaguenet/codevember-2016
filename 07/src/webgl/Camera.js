import vec3 from 'gl-vec3';
import mat4 from 'gl-mat4';

export default class Camera {
  constructor() {
    this.eye = vec3.create();
    this.lookAt = vec3.create();
    this.up = vec3.create();
    this.viewMatrix = mat4.create();
  }

  setEye(x, y, z) {
    this.eye = vec3.set([], x, y, z);
    this.setViewMatrix();
  }

  setLookAt(x, y, z) {
    this.lookAt = vec3.set([], x, y, z);
    this.setViewMatrix();
  }

  setUp(x, y, z) {
    this.up = vec3.set([], x, y, z);
    this.setViewMatrix();
  }

  setViewMatrix() {
    this.viewMatrix = mat4.lookAt([], this.eye, this.lookAt, this.up);
  }

  getViewMatrix() {
    return this.viewMatrix;
  }
}
