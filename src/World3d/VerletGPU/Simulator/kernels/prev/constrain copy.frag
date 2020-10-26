precision highp float;

uniform sampler2D tMap;
uniform vec2 _TexelSize;

varying vec2 vUv;

// #define MAGIC_REST_LENGTH 0.15873003005981445
// #define MAGIC_REST_LENGTH 1.0
#define MAGIC_REST_LENGTH 0.15873003005981445

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
    if(dist == 0.0) return vec3(0.0);
    float percentage = (MAGIC_REST_LENGTH-dist) / dist;
    return delta * percentage * 0.5;

}

void main() {

    vec4 pos = texture2D(tMap, vUv);
    
    vec3 displacement = vec3(0.0, 0.0, 0.0);

    vec2 texelSize = vec2(1.0/64.0);

    vec3 rNeighbour = texture2D(tMap, vUv + vec2(texelSize.x, 0.0)).xyz;
    vec3 lNeighbour = texture2D(tMap, vUv + vec2(-texelSize.x, 0.0)).xyz;
    vec3 tNeighbour = texture2D(tMap, vUv + vec2(0.0, texelSize.y)).xyz;
    vec3 bNeighbour = texture2D(tMap, vUv + vec2(0.0, -texelSize.y)).xyz;

    if(vUv.x < 1.0 - texelSize.x) {
        displacement -= constrain(pos.xyz, rNeighbour); 
    }
    if(vUv.x > texelSize.x) {
        displacement -= constrain(pos.xyz, lNeighbour); 
    }
    if(vUv.y < 1.0 - texelSize.y) {
        displacement -= constrain(pos.xyz, tNeighbour);
    }  
    if(vUv.y > texelSize.y) {
        displacement -= constrain(pos.xyz, bNeighbour); 
    }

    // displacement /= 4.0;
    displacement *= pos.w;

    // if(vUv.x <= 0.0 && vUv.y >= 1.0) displacement *= 0.0;
    // displacement *= 1.0 - step(1.0/15.0, vUv.y);

    pos.xyz = pos.xyz + displacement;

    gl_FragColor = pos;

}