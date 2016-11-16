export default class Triangle {
  constructor(gl, position) {
    this.drawMode = gl.TRIANGLES;

    this.verticeCount = 3;
    this.vertices = new Float32Array([
      0.0, 0.5,
      -0.5, -0.5,
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
