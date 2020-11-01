precision highp float;

uniform sampler2D _InitPos;
uniform float _Size;

varying vec2 vUv;

vec2 getCenterTexel(vec2 coord, vec2 offset) {

    return ((floor(coord * _Size) + 0.5) / (_Size)) + offset;

}

// vec2 getCenterTexel(vec2 coord, vec2 offset) {

//     return ((floor(coord+offset) * _Size) + 0.5) / _Size;

// }


void main() {

    vec2 texelSize = vec2(1.0/_Size);

    vec3 initPos = texture2D(_InitPos, vUv).xyz;

    vec3 rNeighbour = texture2D(_InitPos, getCenterTexel(vUv, vec2(texelSize.x, 0.0))).xyz;
    vec3 lNeighbour = texture2D(_InitPos, getCenterTexel(vUv, vec2(-texelSize.x, 0.0))).xyz;
    vec3 tNeighbour = texture2D(_InitPos, getCenterTexel(vUv, vec2(0.0, texelSize.y))).xyz;
    vec3 bNeighbour = texture2D(_InitPos, getCenterTexel(vUv, vec2(0.0, -texelSize.y))).xyz;

    float rDist = 0.0;
    float lDist = 0.0;
    float tDist = 0.0;
    float bDist = 0.0;

    if(vUv.x < 1.0 - texelSize.x) {
        rDist = length(rNeighbour - initPos );
    }
    if(vUv.x > texelSize.x) {
        lDist = length(lNeighbour - initPos );
    }
    if(vUv.y < 1.0 - texelSize.y) {
        tDist = length(tNeighbour - initPos );
    }  
    if(vUv.y > texelSize.y) {
        bDist = length(bNeighbour - initPos );
    }

    gl_FragColor = vec4(rDist, lDist, tDist, bDist);
    
}