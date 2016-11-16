attribute float a_PointSize;
attribute vec4 a_Position;

void main()
{
  gl_Position = a_Position;
  gl_PointSize = a_PointSize;
}
