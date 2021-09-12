precision mediump float;





attribute vec4 vertColor;
attribute vec3 vertPosition;
attribute vec3 vertNormal;
attribute vec2 vertTexCoord;
varying vec2 fragTexCoord;
varying vec3 fragNormal;
varying vec4 fragColor;

uniform mat4 translate;
uniform mat4 scale;
uniform mat4 rotateX;
uniform mat4 rotateY;
uniform mat4 rotateZ;

varying float fogDepth;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;
void main()
{
    vec4 vPos = mView * mWorld * vec4(vertPosition, 1.0);
    fogDepth = length(vPos.xyz);
    fragTexCoord = vertTexCoord;
    fragNormal = vertNormal;
    fragColor = vertColor;
    gl_Position = mProj * mView * mWorld * translate * scale * rotateZ * rotateY * rotateX *vec4(vertPosition, 1.0);
}