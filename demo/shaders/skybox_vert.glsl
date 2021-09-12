precision mediump float;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

attribute vec3 vertPosition;
varying vec3 fTexCoord;

void main()
{
  
  fTexCoord = vertPosition;
  vec4 viewPos = mView * mWorld * vec4(vertPosition, 0.0);
  viewPos.w = 1.0;
  gl_Position = mProj * viewPos;
}
