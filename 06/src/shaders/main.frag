precision mediump float;

uniform sampler2D u_Sampler0;
uniform sampler2D u_Sampler1;
uniform int u_BlendMode;

varying vec2 v_TexCoord;

void main()
{
  vec4 color0 = texture2D(u_Sampler0, v_TexCoord);
  vec4 color1 = texture2D(u_Sampler1, v_TexCoord);

  if(u_BlendMode == 0)
  {
    gl_FragColor = color0 * color1;
  }

  if(u_BlendMode == 1)
  {
    gl_FragColor = color0 + color1;
  }

  if(u_BlendMode == 2)
  {
    gl_FragColor = color0 - color1;
  }

  if(u_BlendMode == 3)
  {
    gl_FragColor = color0 / color1;
  }
}
