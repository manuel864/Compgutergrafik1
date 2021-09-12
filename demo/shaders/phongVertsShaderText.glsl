precision mediump float;


uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

uniform mat4 translate;
uniform mat4 scale;
uniform mat4 rotateX;
uniform mat4 rotateY;
uniform mat4 rotateZ;

varying float fogDepth;

attribute vec3 vertPosition;
attribute vec3 vertNormal;
attribute vec2 vertTexCoord;

varying vec3 fPosition;
varying vec3 fragNormal;
varying vec2 fTexCoord;

void main()
{

    fTexCoord = vertTexCoord;
    fragNormal =  (mWorld *vec4(vertNormal,0.0)).xyz;

    vec4 vPos = mView * mWorld * vec4(vertPosition, 1.0);
    fogDepth = length(vPos.xyz);

    gl_Position = mProj * mView * mWorld * translate * scale * rotateZ * rotateY * rotateX *vec4(vertPosition, 1.0);
    

    vec4 pos =  mView * mWorld * vec4(vertPosition, 1.0);
    fPosition = pos.xyz / pos.w;
    
}