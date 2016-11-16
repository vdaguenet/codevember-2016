attribute float a_PointSize;
attribute vec4 a_Position;

uniform mat4 u_TransformMatrix;

void main()
{
  gl_Position = u_TransformMatrix * a_Position;
  gl_PointSize = a_PointSize;
}
