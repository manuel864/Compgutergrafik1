precision mediump float;


struct Light {
    vec3 position;
    vec3 lightColor;
    vec3 specColor;
    vec3 direction;
};


struct Material {
    bool useVertColor;
    vec4 color;
    float shininess;
    float spec;
    vec3 ambient;
};
uniform Light pointLight1;
uniform Light pointLight2;
uniform Material mat;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

/*uniform mat4 translate;
uniform mat4 scale;
uniform mat4 rotateX;
uniform mat4 rotateY;
uniform mat4 rotateZ;*/

uniform vec3 eyePosition;

varying vec3 fragNormal;
varying vec2 fTexCoord;
varying vec4 fragColor;
uniform samplerCube skybox;

varying float fogDepth;
uniform vec4 fogColor;
uniform float fogNear;
uniform float fogFar;

void main(){
    vec3 normalizeEye = normalize(eyePosition);
    vec3 normalizeDir = normalize(fragNormal);
    vec3 reflection = textureCube(skybox, reflect(-normalizeEye, normalizeDir)).rgb;
    gl_FragColor =  vec4(reflection, 1.0);
}