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
uniform sampler2D sGrain;
uniform sampler2D sJupiter;
void main()
{
    vec4 jupiter = texture2D(sJupiter, fragTexCoord);
    vec4 grain = texture2D(sGrain, fragTexCoord);
    vec4 overlay = grain * 0.75;
    gl_FragColor = jupiter*overlay;
}