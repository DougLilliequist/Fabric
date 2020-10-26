precision highp float;

uniform sampler2D tMap;
uniform sampler2D _Position;

varying vec2 vUv;

vec2 getCenterTexel(vec2 coord, vec2 offset) {

    return ((floor(coord * 64.0) + 0.5) / 64.0) + offset;

}

void main() {

    vec2 uv = vUv;

    vec2 texelSize = vec2(1.0/64.0);

    vec3 pos = texture2D(_Position, getCenterTexel(vUv, vec2(0.0))).xyz;
    vec3 rNeighbour = texture2D(_Position,getCenterTexel(vUv, vec2(texelSize.x, 0.0))).xyz;
    vec3 lNeighbour = texture2D(_Position, getCenterTexel(vUv, vec2(-texelSize.x, 0.0))).xyz;
    vec3 tNeighbour = texture2D(_Position, getCenterTexel(vUv, vec2(0.0, texelSize.y))).xyz;
    vec3 bNeighbour = texture2D(_Position, getCenterTexel(vUv, vec2(0.0, -texelSize.y))).xyz;

    vec3 tangent = vec3(0.0);
    vec3 biTangent = vec3(0.0);
    vec3 normal = vec3(0.0);

    tangent = (rNeighbour - pos) - (lNeighbour - pos);
    biTangent = (tNeighbour - pos) - (bNeighbour - pos);

    normal = normalize(cross(normalize(biTangent), normalize(tangent)));
    

    gl_FragColor = vec4(normal, 1.0);

}