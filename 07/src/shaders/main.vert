attribute vec4 a_Position;
attribute vec3 a_Color;

uniform mat4 u_ViewMatrix;
uniform mat4 u_TransformMatrix;

varying vec3 v_Color;

void main()
{
  v_Color = a_Color;
  gl_Position = u_ViewMatrix * a_Position;
}
