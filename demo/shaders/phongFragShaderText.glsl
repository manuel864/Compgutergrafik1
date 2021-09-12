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
varying vec3 fragNormal;
varying vec3 fPosition;
varying vec4 fragColor;

//varying vec3 v_surfaceToPointLight [numberOfLights];

varying float fogDepth;
uniform vec4 fogColor;
uniform float fogNear;
uniform float fogFar;

uniform vec3 eyePosition;

//varying vec3 v_surfaceToView;
//varying vec3 fragColor;



void main(){
    gl_FragColor = mat.color;
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
    if (light > 0.0) {
        specular = pow(dot(normal, halfVector), 300.0);
    }
    float lightStrenght =  pow(max(dot(reflect(-v_surfaceToPointLight, normal), vec3(0.0,0.0,1.0)), 0.0), mat.shininess);
    finalLightColor += mat.color.rgb*(light * pointLight1.lightColor);
    finalSpecColor +=  mat.spec*lightStrenght * pointLight1.specColor;

    ////////////////////Zweite Lampe
    specular = 0.0;
    light = 0.0;
    v_surfaceToPointLight = normalize(pointLight2.position - fPosition); //L Vektor: Direction  
    halfVector = normalize(v_surfaceToPointLight + v_surfaceToView);
    light=dot(v_surfaceToPointLight, normal); 
    if (light > 0.0) {
        specular = pow(dot(normal, halfVector), 300.0);
    }
    lightStrenght =  pow(max(dot(reflect(-v_surfaceToPointLight, normal), vec3(0.0,0.0,1.0)), 0.0), mat.shininess);
    finalLightColor += mat.color.rgb*(light * pointLight2.lightColor);
    finalSpecColor +=  mat.spec*lightStrenght * pointLight2.specColor;




    float fogAmount = smoothstep(fogNear, fogFar, fogDepth);


    gl_FragColor = mix(vec4(finalLightColor,mat.color.a), fogColor, fogAmount);
    gl_FragColor.rgb += finalSpecColor;
}