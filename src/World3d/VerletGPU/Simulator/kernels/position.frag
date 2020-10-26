precision highp float;

uniform sampler2D _CurrentPos;
uniform sampler2D _PrevPos;

varying vec2 vUv;

#define INERTIA 0.999

vec2 getCenterTexel(vec2 coord) {

    return (floor(coord * 64.0) + 0.5) / 64.0;

}

void main() {

    vec4 x = texture2D(_CurrentPos, vUv);
    vec3 oldX = texture2D(_PrevPos, vUv).xyz;
    vec3 delta = INERTIA * (x.xyz-oldX);
    // delta += vec3(0.0, -0.5, 0.0) * 0.01 * 0.01;
    // delta *= x.w;
    // verlet *= 1.0 - step(1.0/15.0, vUv.y);
    x.xyz = x.xyz + delta;

    gl_FragColor = x;

}