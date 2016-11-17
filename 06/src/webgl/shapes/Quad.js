export default class Quad {
  constructor(gl, position, texture) {
    this.drawMode = gl.TRIANGLE_STRIP;
    this.verticeCount = 4;
    this.verticesUv = new Float32Array([
      -0.5, 0.5, 0.0, 1.0,
      -0.5, -0.5, 0.0, 0.0,
      0.5, 0.5, 1.0, 1.0,
      0.5, -0.5, 1.0, 0.0
    ]);

    this.vertexUvBuffer = gl.createBuffer();
    if (!this.vertexUvBuffer) {
      console.error('Failed to create buffer object');
      return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexUvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.verticesUv, gl.STATIC_DRAW);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, this.verticesUv.BYTES_PER_ELEMENT * 4, 0);
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(texture, 2, gl.FLOAT, false, this.verticesUv.BYTES_PER_ELEMENT * 4, this.verticesUv.BYTES_PER_ELEMENT * 2);
    gl.enableVertexAttribArray(texture);
  }
}
