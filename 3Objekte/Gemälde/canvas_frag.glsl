precision mediump float;

varying vec2 fragTexCoord;
uniform sampler2D sPic;
void main()
{
    gl_FragColor = texture2D(sPic, fragTexCoord);
}