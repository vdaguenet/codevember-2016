export default class Triangle {
  constructor(gl, position, color) {
    this.drawMode = gl.TRIANGLES;

    this.verticeCount = 3;
    this.data = new Float32Array([
      0.0, 0.5, 1.0, 0.0, 0.0,
      -0.5, -0.5, 0.0, 1.0, 0.0,
      0.5, -0.5, 0.0, 0.0, 1.0
    ]);

    this.vertexBuffer = gl.createBuffer();
    if (!this.vertexBuffer) {
      console.error('Failed to create buffer object');
      return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.data, gl.STATIC_DRAW);

    // Bind attributes
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, this.data.BYTES_PER_ELEMENT * 5, 0);
    gl.enableVertexAttribArray(position);

    gl.vertexAttribPointer(color, 3, gl.FLOAT, false, this.data.BYTES_PER_ELEMENT * 5, this.data.BYTES_PER_ELEMENT * 2);
    gl.enableVertexAttribArray(color);
  }
}
