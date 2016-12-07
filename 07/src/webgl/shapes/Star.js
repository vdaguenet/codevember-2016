export default class Triangle {
  constructor(gl, position) {
    this.drawMode = gl.LINE_LOOP;

    this.verticeCount = 10;
    this.vertices = new Float32Array([
      0.0, 0.8,
      -0.18, 0.4,
      -0.6, 0.4,
      -0.25, 0.1,
      -0.4, -0.35,
      0.0, -0.1, // sim
      0.4, -0.35,
      0.25, 0.1,
      0.6, 0.4,
      0.18, 0.4
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
