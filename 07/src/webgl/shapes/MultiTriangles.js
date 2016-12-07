export default class MultiTriangles {
  constructor(gl, position, color) {
    this.drawMode = gl.TRIANGLES;

    this.verticeCount = 9;
    this.data = new Float32Array([
      0.0, 0.5, -0.4, 0.4, 1.0, 0.4, // back greend triangle
      -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
      0.5, -0.5, -0.4, 1.0, 0.4, 0.4,

      0.5, 0.4, -0.2, 1.0, 0.4, 0.4, // middle yellow triangle
      -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
      0.0, -0.6, -0.2, 1.0, 1.0, 0.4,

      0.0, 0.5, 0.0, 0.4, 0.4, 1.0, // front blue triangle
      -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
      0.5, -0.5, 0.0, 1.0, 0.4, 0.4
    ]);

    this.vertexBuffer = gl.createBuffer();
    if (!this.vertexBuffer) {
      console.error('Failed to create buffer object');
      return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.data, gl.STATIC_DRAW);

    // Bind attributes
    gl.vertexAttribPointer(position, 3, gl.FLOAT, false, this.data.BYTES_PER_ELEMENT * 6, 0);
    gl.enableVertexAttribArray(position);

    gl.vertexAttribPointer(color, 3, gl.FLOAT, false, this.data.BYTES_PER_ELEMENT * 6, this.data.BYTES_PER_ELEMENT * 3);
    gl.enableVertexAttribArray(color);
  }
}
