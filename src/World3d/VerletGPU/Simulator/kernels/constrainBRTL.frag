precision highp float;

uniform sampler2D tMap;
uniform vec2 _TexelSize;
uniform float _Flip;
uniform sampler2D _RestLength;
uniform float _Stiffness;

varying vec2 vUv;

vec3 constrain(vec3 a, vec3 b, float restLength) {

    vec3 delta = b - a;
    float dist = length(delta);
       if(dist <= 0.01) {
        return vec3(0.0, 0.0, 0.0);
    }
    float percentage = (dist-restLength) / dist;
    return delta * percentage * _Stiffness;

}

vec2 getCenterTexel(vec2 coord, vec2 offset) {

    return ((floor(coord * 64.0) + 0.5) / 64.0) + offset;

}

//inspired by:
//https://pdfs.semanticscholar.org/4718/6dcbbc8ccc01c6f4143719d09ed5ab4395fb.pdf?_ga=2.107277378.1544954547.1603025794-293436447.1603025794

void main() {

    vec4 pos = texture2D(tMap, getCenterTexel(vUv, vec2(0.0)));
    
    //r = top right
    //g = bottom left
    //b = top left
    //w = bottom right
    vec2 restLength = texture2D(_RestLength, vUv).zw;
    vec3 displacement = vec3(0.0, 0.0, 0.0);

    vec2 texelSize = vec2(1.0/64.0);

    //floor uv coordinate to get integer representation
    //so we know which particle to go towards
    vec2 floorCoord = floor(vUv * 63.0);
    vec2 modFloorCoord = mod(floorCoord, 2.0);
    bool constrainA = modFloorCoord.x == mix(1.0, 0.0, _Flip) && (vUv.y < 1.0 - texelSize.y) && (vUv.x > texelSize.x);
    bool constrainB = modFloorCoord.x == mix(0.0, 1.0, _Flip) && (vUv.y > texelSize.y) && (vUv.x < 1.0 - texelSize.x);

    vec3 x1 = texture2D(tMap, getCenterTexel(vUv, vec2(-texelSize.x, texelSize.y))).xyz;
    vec3 x2 = texture2D(tMap, getCenterTexel(vUv, vec2(texelSize.x, -texelSize.y))).xyz;

    if(constrainA) {
        displacement = constrain(pos.xyz, x1, restLength.x);
    }

    if(constrainB) {
        displacement = constrain(pos.xyz, x2, restLength.y);
    }

    // displacement *= pos.w;

    pos.xyz = pos.xyz + displacement;

    gl_FragColor = pos;

}