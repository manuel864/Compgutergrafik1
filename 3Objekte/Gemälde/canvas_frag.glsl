precision mediump float;

varying vec2 fragTexCoord;
uniform sampler2D sPic;

varying float fogDepth;
uniform vec4 fogColor;
uniform float fogNear;
uniform float fogFar;
void main()
{
    vec4 color = texture2D(sPic, fragTexCoord);
    float fogAmount = smoothstep(fogNear, fogFar, fogDepth);
    gl_FragColor = mix(color, fogColor, fogAmount);
}