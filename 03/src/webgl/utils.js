export function getWebGLContext(canvas) {
  // Get the rendering context for WebGL
  const gl = canvas.getContext('webgl');

  if (!gl) {
    console.error('WebGL not supported');
    return false;
  }

  return gl;
}

export function loadShader(gl, type, source) {
  // Create shader object
  const shader = gl.createShader(type);
  if (!shader) {
    console.error('unable to create shader');
    return false;
  }
  // Set the shader program
  gl.shaderSource(shader, source);
  // Compile the shader
  gl.compileShader(shader);
  // Check the result of compilation
  const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    const error = gl.getShaderInfoLog(shader);
    console.error('Failed to compile shader: ' + error);
    gl.deleteShader(shader);
    return false;
  }

  return shader;
}

export function createProgram(gl, vshader, fshader) {
  // Create shader object
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
  if (!vertexShader || !fragmentShader) {
    return false;
  }

  // Create a program object
  const program = gl.createProgram();
  if (!program) { return false; }

  // Attach the shader objects
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  // Link the program object
  gl.linkProgram(program);
  // Check the result of linking
  const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    const error = gl.getProgramInfoLog(program);
    console.error('Failed to link program: ' + error);
    gl.deleteProgram(program);
    gl.deleteShader(fragmentShader);
    gl.deleteShader(vertexShader);

    return false;
  }

  return program;
}
