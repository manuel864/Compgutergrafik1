precision mediump float;

attribute vec3 vertPosition;
attribute vec3 vertNormal;
attribute vec2 vertTexCoord;
varying vec2 fragTexCoord;
varying vec3 fragNormal;

uniform mat4 translate;
uniform mat4 scale;
uniform mat4 rotateX;
uniform mat4 rotateY;
uniform mat4 rotateZ;


uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

void main()
{
    fragNormal = vertNormal;
    fragTexCoord = vertTexCoord;
    gl_Position = mProj * mView * mWorld * translate * scale * rotateZ * rotateY * rotateX *vec4(vertPosition, 1.0);
}