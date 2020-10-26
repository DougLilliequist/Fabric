precision highp float;

uniform sampler2D _Positions;

varying vec2 vUv;

vec2 getCenterTexel(vec2 coord) {

    return (floor(coord * 64.0) + 0.5) / 64.0;

}

void main() {

    gl_FragColor = texture2D(_Positions, (vUv));

}