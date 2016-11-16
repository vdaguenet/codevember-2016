export default class Quad {
  constructor(gl, position) {
    this.drawMode = gl.TRIANGLE_STRIP;
    this.verticeCount = 4;
    this.vertices = new Float32Array([
      -0.5, 0.5,
      -0.5, -0.5,
      0.5, 0.5,
      0.5, -0.5
    ]);

    this.vertexBuffer = gl.createBuffer();
    if (!this.vertexBuffer) {
      console.error('Failed to create buffer object');
      return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

    // Bind attributes
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(position);
  }
}
