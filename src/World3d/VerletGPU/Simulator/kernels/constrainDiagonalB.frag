precision highp float;

uniform sampler2D tMap;
uniform vec2 _TexelSize;
uniform float _Flip;

varying vec2 vUv;

#define MAGIC_REST_LENGTH 0.015
// #define MAGIC_REST_LENGTH 1.0
// #define MAGIC_REST_LENGTH 0.0634921
// #define MAGIC_REST_LENGTH 0.0158730149269104

vec3 constrainA(vec3 a, vec3 b) {

    vec3 delta = b - a;
    float dist = length(delta);
    if(dist == 0.0) {
        return vec3(0.0, 0.0, 0.0);
    }

    float percentage = (dist - MAGIC_REST_LENGTH) / dist;

    return delta * percentage * 0.5;

}

vec3 constrainB(vec3 a, vec3 b) {

    vec3 delta = b - a;
    float dist = length(delta);
    if(dist == 0.0) {
        return vec3(0.0, 0.0, 0.0);
    }

    float percentage = (dist - MAGIC_REST_LENGTH) / dist;

    return delta * 0.5;

}

vec3 constrain(vec3 a, vec3 b) {

    vec3 delta = b - a;
    float dist = length(delta);
       if(dist == 0.0) {
        return vec3(0.0, 0.0, 0.0);
    }
    float percentage = (dist-MAGIC_REST_LENGTH) / dist;
    return delta * percentage * 0.5;

}

vec2 getCenterTexel(vec2 coord) {

    return (floor(coord * 64.0) + 0.5) / 64.0;

}

//https://pdfs.semanticscholar.org/4718/6dcbbc8ccc01c6f4143719d09ed5ab4395fb.pdf?_ga=2.107277378.1544954547.1603025794-293436447.1603025794
//For the constraints: the cyrill's approach which would be something like...
//pass1: if((uv.x * count) % 2 == 0) apply constraints
//pass2: if((uv.x * count) % 2 == 1) apply constraints
//which wont work because it goes in one direction

//but this might work:
//pass1: if((uv.x * count) % 2 == 0) apply constraints (right neighbour)
//next
//if((uv.x * count) % 2 == 1) apply constraints (left neighbour)

//pass2:
//if((uv.x * count) % 2 == 1) apply constraints (right neighbour)
//if((uv.x * count) % 2 == 0) apply constraints (left neighbour)

//same process for top and bottom springs

void main() {

    vec4 pos = texture2D(tMap, vUv);
    vec3 displacement = vec3(0.0, 0.0, 0.0);

    vec2 texelSize = vec2(1.0/32.0);

    //floor uv coordinate to get integer representation
    //so we know which particle to go towards
    float floorCoord = floor(vUv.y * 31.0);
    float modFloorCoord = mod(floorCoord, 2.0);
    bool constrainA = modFloorCoord == mix(0.0, 1.0, _Flip);
    bool constrainB = modFloorCoord == mix(1.0, 0.0, _Flip);

    bool isBl = (vUv.x > texelSize.x) && (vUv.y > texelSize.y);
    bool isTr = (vUv.x < 1.0 - texelSize.x) && (vUv.y < 1.0 - texelSize.y);

    vec3 x1 = texture2D(tMap,(vUv + vec2(-texelSize.x, -texelSize.y))).xyz;
    vec3 x2 = texture2D(tMap, (vUv + vec2(texelSize.x, texelSize.y))).xyz;

    if(isBl) {
        displacement = constrain(pos.xyz, x1);
    }

    if(isTr) {
        displacement = constrain(pos.xyz, x2);
    }

    displacement *= pos.w;

    pos.xyz = pos.xyz + displacement;

    gl_FragColor = pos;

}