precision highp float;

uniform sampler2D _Positions;
uniform float _Size;

varying vec2 vUv;


void main() {

    gl_FragColor = texture2D(_Positions,vUv);

}