precision mediump float;


uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

uniform vec3 eyePosition;

attribute vec3 vertPosition;
attribute vec3 vertNormal;

varying vec3 fPosition;
varying vec3 fragNormal;

void main()
{

    fragNormal =  (mWorld *vec4(vertNormal,0.0)).xyz;
    gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);

    vec4 pos =  mView * mWorld * vec4(vertPosition, 1.0);
    fPosition = pos.xyz / pos.w;
    
}