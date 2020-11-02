precision highp float;

uniform sampler2D tMap;
uniform sampler2D _Position;
uniform float _Size;

varying vec2 vUv;

void main() {

    vec2 uv = vUv;

    vec2 texelSize = vec2(1.0/_Size);

    vec3 pos = texture2D(_Position, (vUv)).xyz;
    vec3 rNeighbour = texture2D(_Position, (vUv + vec2(texelSize.x, 0.0))).xyz;
    vec3 lNeighbour = texture2D(_Position, (vUv + vec2(-texelSize.x, 0.0))).xyz;
    vec3 tNeighbour = texture2D(_Position, (vUv + vec2(0.0, texelSize.y))).xyz;
    vec3 bNeighbour = texture2D(_Position, (vUv + vec2(0.0, -texelSize.y))).xyz;

    vec3 tangent = vec3(0.0);
    vec3 biNormal = vec3(0.0);
    vec3 normal = vec3(0.0);

    vec3 tangentDeltaA = vec3(0.0);
    vec3 tangentDeltaB = vec3(0.0);

    vec3 biNormalDeltaA = vec3(0.0);
    vec3 biNormalDeltaB = vec3(0.0);

    tangent = rNeighbour - pos;
    if(vUv.x > 1.0 - texelSize.x) {
         tangent = pos - lNeighbour;
    }

    biNormal = tNeighbour - pos;
    if(vUv.y > 1.0 - texelSize.y) {
        biNormal = pos - bNeighbour;
    }

    normal = normalize(cross(tangent, biNormal));
    

    gl_FragColor = vec4(normal, 1.0);

}