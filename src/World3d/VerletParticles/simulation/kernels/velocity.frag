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
    // vec3 prevPos = currentPos - vel;
    
    vec3 dir = vec3(0.0, 0.0, 0.0);

    dir = (currentPos - prevPos);

    if(currentPos.x >= BOUNDS) {
        prevPos.x = currentPos.x + vel.x;
        dir = (currentPos - prevPos) * BOUNCE;
    } else if(currentPos.x <= -BOUNDS) {
        prevPos.x = currentPos.x + vel.x;
        dir = (currentPos - prevPos) * BOUNCE;
    }

    if(currentPos.y >= BOUNDS) {
        prevPos.y = currentPos.y + vel.y;
        dir = (currentPos - prevPos) * BOUNCE;
    } else if(currentPos.y <= -BOUNDS) {
        prevPos.y = currentPos.y + vel.y;
        dir = (currentPos - prevPos) * BOUNCE;
    }

    if(currentPos.z >= BOUNDS) {
        prevPos.z = currentPos.z + vel.z;
        dir = currentPos - prevPos;
    } else if(currentPos.z <= -BOUNDS) {
        prevPos.z = currentPos.z + vel.z;
        dir = (currentPos - prevPos) * BOUNCE;
    }
    
    // vel = dir * 0.96;
    dir += vec3(0.0, -0.01, 0.0);
    dir *= 0.99;

    gl_FragColor = vec4(dir, 1.0);

}