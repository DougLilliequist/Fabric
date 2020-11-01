precision highp float;

uniform sampler2D _Positions;
uniform float _Size;

varying vec2 vUv;

vec2 getCenterTexel(vec2 coord, vec2 offset) {

    return ((floor(coord * _Size) + 0.5) / (_Size)) + offset;

}

// vec2 getCenterTexel(vec2 coord, vec2 offset) {

//     return ((floor(coord+offset) * _Size) + 0.5) / _Size;

// }


void main() {

    gl_FragColor = texture2D(_Positions,getCenterTexel(vUv, vec2(0.0)));

}