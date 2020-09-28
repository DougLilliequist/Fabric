precision highp float;

uniform sampler2D tMap; //position
uniform sampler2D _Velocity;
uniform sampler2D _PrevPosition;

varying vec2 vUv;

#define BOUNDS 5.0

void main() {

    vec4 pos = texture2D(tMap,vUv).xyzw;
    vec3 vel = texture2D(_Velocity, vUv).xyz;
    pos.xyz += vel;

    if(pos.x > BOUNDS) {
        pos.x = BOUNDS;
    } else if(pos.x < -BOUNDS) {
        pos.x = -BOUNDS;
    }

    if(pos.y > BOUNDS) {
        pos.y = BOUNDS;
    } else if(pos.y < -BOUNDS) {
        pos.y = -BOUNDS;
    }

    if(pos.z > BOUNDS) {
        pos.z = BOUNDS;
    } else if(pos.z < -BOUNDS) {
        pos.z = -BOUNDS;
    }

    gl_FragColor = vec4(pos.xyz, pos.w);

}