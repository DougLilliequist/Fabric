precision highp float;

uniform sampler2D tMap;
uniform vec2 _TexelSize;
uniform sampler2D _RestLength;

varying vec2 vUv;

vec3 constrain(vec3 a, vec3 b, float restLen) {

    vec3 delta = b - a;
    float dist = length(delta);
    if(dist <= 0.01) return vec3(0.0);
    float percentage = (dist- restLen) / dist;
    return delta * percentage * 0.2;
}


vec2 getCenterTexel(vec2 coord, vec2 offset) {

    return ((floor(coord * 64.0) + 0.5) / 64.0) + offset;

}

void main() {

    vec4 pos = texture2D(tMap, vUv);

    //r = right
    //g = left
    //b = top
    //w = bottom
    vec4 restLength = texture2D(_RestLength, vUv);
    
    vec3 displacement = vec3(0.0, 0.0, 0.0);

    vec2 texelSize = vec2(1.0/64.0);

    vec3 rNeighbour = texture2D(tMap,getCenterTexel(vUv, vec2(texelSize.x, 0.0))).xyz;
    vec3 lNeighbour = texture2D(tMap, getCenterTexel(vUv, vec2(-texelSize.x, 0.0))).xyz;
    vec3 tNeighbour = texture2D(tMap, getCenterTexel(vUv, vec2(0.0, texelSize.y))).xyz;
    vec3 bNeighbour = texture2D(tMap, getCenterTexel(vUv, vec2(0.0, -texelSize.y))).xyz;

    // vec3 blNeighbour = texture2D(tMap,(vUv + vec2(-texelSize.x, -texelSize.y))).xyz;
    // vec3 tlNeighbour = texture2D(tMap, (vUv + vec2(-texelSize.x, texelSize.y))).xyz;
    // vec3 brNeighbour = texture2D(tMap, (vUv + vec2(texelSize.x, -texelSize.y))).xyz;
    // vec3 trNeighbour = texture2D(tMap, (vUv + vec2(texelSize.x, texelSize.y))).xyz;

    //horizontal and vertical constraints
    if(vUv.x < 1.0 - texelSize.x) {
        displacement = displacement + constrain(pos.xyz, rNeighbour, restLength.x); 
    }
    if(vUv.x > texelSize.x) {
        displacement = displacement + constrain(pos.xyz, lNeighbour, restLength.y); 
    }
    if(vUv.y < 1.0 - texelSize.y) {
        displacement = displacement + constrain(pos.xyz, tNeighbour, restLength.z);
    }  
    if(vUv.y > texelSize.y) {
        displacement = displacement + constrain(pos.xyz, bNeighbour, restLength.w);
    }

    // bool isBl = (vUv.x > texelSize.x) && (vUv.y > texelSize.y);
    // bool isTl = (vUv.x > texelSize.x) && (vUv.y < 1.0 - texelSize.y);
    // bool isBr = (vUv.x < 1.0 - texelSize.x) && (vUv.y > texelSize.y);
    // bool isTr = (vUv.x < 1.0 - texelSize.x) && (vUv.y < 1.0 - texelSize.y);

    // if(isBl) {
    //     displacement = displacement + constrain(pos.xyz, blNeighbour, MAGIC_REST_LENGTH); 
    // }
    // if(isTl) {
    //     displacement = displacement + constrain(pos.xyz, tlNeighbour, MAGIC_REST_LENGTH); 
    // }
    // if(isBr) {
    //     displacement = displacement + constrain(pos.xyz, brNeighbour, MAGIC_REST_LENGTH);
    // }  
    // if(isTr) {
    //     displacement = displacement + constrain(pos.xyz, trNeighbour, MAGIC_REST_LENGTH);
    // }

    pos.xyz = pos.xyz + displacement * pos.w;

    gl_FragColor = pos;

}