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

uniform vec3 eyePosition;

varying float fogDepth;
uniform vec4 fogColor;
uniform float fogNear;
uniform float fogFar;

varying vec2 fragTexCoord;
varying vec3 fragNormal;
varying vec4 fragColor;
void main()
{
    gl_FragColor = fragColor;
}