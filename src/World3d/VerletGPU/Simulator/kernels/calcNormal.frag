precision highp float;

uniform sampler2D tMap;
uniform sampler2D _Position;
uniform float _Size;

varying vec2 vUv;

//( floor( coord * (SIZE-1) ) + 0.5 ) / SIZE



vec2 getCenterTexel(vec2 coord, vec2 offset) {

    return ((floor(coord * _Size) + 0.5) / (_Size)) + offset;

}


// vec2 getCenterTexel(vec2 coord, vec2 offset) {

//     return ((floor(coord+offset) * _Size) + 0.5) / _Size;

// }


void main() {

    vec2 uv = vUv;

    vec2 texelSize = vec2(1.0/_Size);

    vec3 pos = texture2D(_Position, getCenterTexel(vUv, vec2(0.0))).xyz;
    vec3 rNeighbour = texture2D(_Position, getCenterTexel(vUv, vec2(texelSize.x, 0.0))).xyz;
    vec3 lNeighbour = texture2D(_Position, getCenterTexel(vUv, vec2(-texelSize.x, 0.0))).xyz;
    vec3 tNeighbour = texture2D(_Position, getCenterTexel(vUv, vec2(0.0, texelSize.y))).xyz;
    vec3 bNeighbour = texture2D(_Position, getCenterTexel(vUv, vec2(0.0, -texelSize.y))).xyz;

    // vec3 tRNeighbour = texture2D(_InitPos, getCenterTexel(vUv, vec2(texelSize.x, texelSize.y))).xyz;
    // vec3 bLNeighbour = texture2D(_InitPos, getCenterTexel(vUv, vec2(-texelSize.x, -texelSize.y))).xyz;
    // vec3 tLNeighbour = texture2D(_InitPos, getCenterTexel(vUv, vec2(-texelSize.x, texelSize.y))).xyz;
    // vec3 bRNeighbour = texture2D(_InitPos, getCenterTexel(vUv, vec2(texelSize.x, -texelSize.y))).xyz;

    vec3 tangent = vec3(0.0);
    vec3 biNormal = vec3(0.0);
    vec3 normal = vec3(0.0);

    vec3 tangentDeltaA = vec3(0.0);
    vec3 tangentDeltaB = vec3(0.0);

    vec3 biNormalDeltaA = vec3(0.0);
    vec3 biNormalDeltaB = vec3(0.0);

    float flipNormal = 1.0;

    // if(vUv.x < 1.0 - texelSize.x) tangentDeltaA = rNeighbour - pos;
    // if(vUv.x > texelSize.x) tangentDeltaB = pos - lNeighbour;

    // if(vUv.y < 1.0 - texelSize.y) biNormalDeltaA = tNeighbour - pos;
    // if(vUv.y > texelSize.y) biNormalDeltaB = pos - bNeighbour;

    // tangent = tangentDeltaB - tangentDeltaA;
    // biNormal = biNormalDeltaB - biNormalDeltaA;

    // normal = normalize(cross((biNormal), (tangent)));

    tangent = rNeighbour - pos;
    if(vUv.x > 1.0 - texelSize.x) {
         tangent = lNeighbour - pos;
         flipNormal = -1.0;
    }

    biNormal = tNeighbour - pos;
    if(vUv.y > 1.0 - texelSize.y) {
        biNormal = bNeighbour - pos;
        flipNormal = -1.0;
    }

    // tangent = tangentDeltaB - tangentDeltaA;
    // biNormal = biNormalDeltaB - biNormalDeltaA;

    // tangent = tangentDeltaA + tangentDeltaB;
    // biNormal = biNormalDeltaA + biNormalDeltaB;

    normal = normalize(cross(biNormal, tangent)) * flipNormal;
    

    gl_FragColor = vec4(normal, 1.0);

}