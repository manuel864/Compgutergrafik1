precision mediump float;

attribute vec3 vertPosition;
attribute vec4 vertColor;
varying vec4 fragColor;
uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

void main()
{
    fragColor = vertColor;
    gl_Position =  mProj * mView * mWorld * vec4(vertPosition, 1.0);
}