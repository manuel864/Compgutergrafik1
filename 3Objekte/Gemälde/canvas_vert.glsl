precision mediump float;

attribute vec3 vertPosition;
attribute vec2 vertTexCoord;
varying vec2 fragTexCoord;

varying float fogDepth;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

void main()
{
    fragTexCoord = vertTexCoord;
    vec4 vPos =  mView * mWorld * vec4(vertPosition, 1.0);
    fogDepth = length(vPos.xyz);
    gl_Position = mProj * vPos;
}