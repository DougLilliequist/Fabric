precision highp float;

uniform sampler2D _InitPos;

varying vec2 vUv;

vec2 getCenterTexel(vec2 coord, vec2 offset) {

    return ((floor(coord * 64.0) + 0.5) / 64.0) + offset;

}

void main() {

    vec2 texelSize = vec2(1.0/64.0);

    vec3 initPos = texture2D(_InitPos, vUv).xyz;

    vec3 tRNeighbour = texture2D(_InitPos, getCenterTexel(vUv, vec2(texelSize.x, texelSize.y))).xyz;
    vec3 bLNeighbour = texture2D(_InitPos, getCenterTexel(vUv, vec2(-texelSize.x, -texelSize.y))).xyz;
    vec3 tLNeighbour = texture2D(_InitPos, getCenterTexel(vUv, vec2(-texelSize.x, texelSize.y))).xyz;
    vec3 bRNeighbour = texture2D(_InitPos, getCenterTexel(vUv, vec2(texelSize.x, -texelSize.y))).xyz;

    float trDist = 0.0;
    float tlDist = 0.0;

    float brDist = 0.0;
    float blDist = 0.0;

    vec2 floorCoord = floor(vUv * 63.0);
    vec2 modFloorCoord = mod(floorCoord, 2.0);

    bool isTr = vUv.x < 1.0 - texelSize.x && vUv.y < 1.0 - texelSize.y;
    bool isBl = vUv.x > texelSize.x && vUv.y > texelSize.y;

    bool isTl = vUv.x > texelSize.x && vUv.y < 1.0 - texelSize.y;
    bool isBr = vUv.x < 1.0 - texelSize.x && vUv.y > texelSize.y;

    if(isTr) {
        trDist = length(tRNeighbour - initPos );
    }
    if(isBl) {
        blDist = length(bLNeighbour - initPos );
    } 
    if(isTl) {
        tlDist = length(tLNeighbour - initPos );
    }
    if(isBr) {
        brDist = length(bRNeighbour - initPos );
    } 

    // gl_FragColor = vec4(blDist, trDist, brDist, tlDist);
    gl_FragColor = vec4(trDist, blDist, tlDist, brDist);
    
}