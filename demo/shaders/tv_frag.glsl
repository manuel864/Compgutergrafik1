precision mediump float;

struct Light {
    vec3 position;
    vec3 lightColor;
    vec3 specColor;
    vec3 direction;
};


struct Material {
    vec4 color;
    float shininess;
    float spec;
    vec3 ambient;
};
uniform Light pointLight1;
uniform Light pointLight2;
uniform Material mat;

uniform vec3 eyePosition;

varying vec2 fragTexCoord;
varying vec3 fragNormal;
uniform sampler2D sPic;
void main()
{
    gl_FragColor = texture2D(sPic, fragTexCoord);
}