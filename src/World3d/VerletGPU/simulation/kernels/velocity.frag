precision highp float;

uniform sampler2D tMap; //velocity
uniform sampler2D _Position;
uniform sampler2D _PrevPosition;
uniform float _TexelSize;

varying vec2 vUv;

#define CONSTRAINT 0.0001

#define BOUNDS 5.0
#define BOUNCE 0.9

void main() {

    vec3 vel = texture2D(tMap,vUv).xyz;
    
    vec4 pos = texture2D(_Position, vUv).xyzw;
    vec3 currentPos = pos.xyz;
    vec3 prevPos = texture2D(_PrevPosition, vUv).xyz;
    vec3 delta = currentPos - prevPos;
    delta *= 0.1;
    // dir += vec3(0.0, -0.0001, 0.0);

    gl_FragColor = vec4(delta, 1.0);

}