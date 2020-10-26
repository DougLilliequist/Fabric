precision highp float;

uniform sampler2D _Texture;

varying vec2 vUv;

void main() {

    vec4 col = texture2D(_Texture, vUv);

    gl_FragColor = col;

}