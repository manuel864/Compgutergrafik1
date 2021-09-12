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
varying vec3 fragNormal;
varying vec3 fPosition;

uniform vec3 eyePosition;

varying vec2 fragTexCoord;
uniform sampler2D sGrain;
uniform sampler2D sJupiter;

//varying vec3 v_surfaceToPointLight [numberOfLights];

varying float fogDepth;
uniform vec4 fogColor;
uniform float fogNear;
uniform float fogFar;

//varying vec3 v_surfaceToView;
//varying vec3 fragColor;
void main()
{
    
    vec4 jupiter = texture2D(sJupiter, fragTexCoord);
    vec4 grain = texture2D(sGrain, fragTexCoord);
    vec3 mixColor = mix(jupiter.rgb, vec3(0.0, 1.0, 0.0), grain.rgb);

    vec4 color =  vec4(mixColor,1.0);
    vec3 normal = normalize(fragNormal); 
    vec3 v_surfaceToView = normalize(eyePosition - fPosition);
    vec3 finalLightColor = mat.ambient;
    vec3 finalSpecColor = vec3(0.0,0.0,0.0);
    /////////Erste Lampe
    float specular = 0.0;
    float light = 0.0;
    vec3 v_surfaceToPointLight = normalize(pointLight1.position - fPosition); //L Vektor: Direction  
    vec3 halfVector = normalize(v_surfaceToPointLight + v_surfaceToView);
    light=dot(v_surfaceToPointLight, normal); 
    
    float lightStrenght =  pow(max(dot(reflect(-v_surfaceToPointLight, normal), vec3(0.0,0.0,1.0)), 0.0), mat.shininess);
    finalLightColor += color.rgb*(light * pointLight1.lightColor);
    finalSpecColor +=  mat.spec*lightStrenght * pointLight1.specColor;

    ////////////////////Zweite Lampe
    specular = 0.0;
    light = 0.0;
    v_surfaceToPointLight = normalize(pointLight2.position - fPosition); //L Vektor: Direction  
    halfVector = normalize(v_surfaceToPointLight + v_surfaceToView);
    light=dot(v_surfaceToPointLight, normal); 
    
    lightStrenght =  pow(max(dot(reflect(-v_surfaceToPointLight, normal), vec3(0.0,0.0,1.0)), 0.0), mat.shininess);
    finalLightColor += color.rgb*(light * pointLight2.lightColor);
    finalSpecColor +=  mat.spec*lightStrenght * pointLight2.specColor;


    




    float fogAmount = smoothstep(fogNear, fogFar, fogDepth);
    gl_FragColor = mix(vec4(finalLightColor,mat.color.a), fogColor, fogAmount);
    gl_FragColor.rgb += finalSpecColor;
    
}