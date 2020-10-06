precision highp float;

uniform sampler2D tMap;
uniform sampler2D _Position;
uniform vec2 _Offset;
uniform float _Flip;

varying vec2 vUv;

float isEqual(in vec3 a, in vec3 b) {

    return 1.0 - abs(sign(dot(a,a) - dot(b,b)));

}

void main() {   

    vec2 pointACoord = vUv + mix(vec2(0.0), _Offset);
    vec2 pointBCoord = vUv + mix(_Offset, vec2(0.0));

    vec3 pointA = texture2D(_Position, pointACoord);
    vec3 pointB = texture2D(_Position, pointBCoord);

    if(isEqual(pointA, pointB) >= 1.0) {

        pointBCoord = vUv - 

    }

}