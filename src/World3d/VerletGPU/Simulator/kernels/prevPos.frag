precision highp float;

uniform sampler2D _Positions;
uniform float _Size;

varying vec2 vUv;


void main() {

    // gl_FragColor = texture2D(_Positions,getCenterTexel(vUv, vec2(0.0)));
    gl_FragColor = texture2D(_Positions,(vUv));

}