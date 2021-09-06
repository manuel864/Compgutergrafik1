precision mediump float;

varying vec2 fragTexCoord;
uniform sampler2D sGrain;
uniform sampler2D sJupiter;
void main()
{
    vec4 jupiter = texture2D(sJupiter, fragTexCoord);
    vec4 grain = texture2D(sGrain, fragTexCoord);
    vec4 overlay = grain * 0.75;
    gl_FragColor = jupiter * overlay;
}