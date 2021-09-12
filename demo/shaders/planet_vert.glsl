precision mediump float;

attribute vec3 vertPosition;
attribute vec2 vertTexCoord;
varying vec2 fragTexCoord;
attribute vec3 vertNormal;
varying vec3 fragNormal;
attribute vec4 vertColor;
varying vec4 fColor;

uniform mat4 translate;
uniform mat4 scale;
uniform mat4 rotateX;
uniform mat4 rotateY;
uniform mat4 rotateZ;

varying float fogDepth;

varying vec3 fPosition;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

void main()
{
    fColor = vertColor;
    fragNormal =  (mWorld *vec4(vertNormal,0.0)).xyz;
    fragTexCoord = vertTexCoord;

    vec4 vPos = mView * mWorld * vec4(vertPosition, 1.0);
    fogDepth = length(vPos.xyz);

    gl_Position = mProj * mView * mWorld * translate * scale * rotateZ * rotateY * rotateX *vec4(vertPosition, 1.0);


    vec4 pos =  mView * mWorld * vec4(vertPosition, 1.0);
    fPosition = pos.xyz / pos.w;
}