precision highp float;

uniform sampler2D tMap;
uniform sampler2D _Position;
uniform vec2 _Offset;
uniform float _Flip;
uniform float _RestLength; //works on uniform grid...

varying vec2 vUv;

float isEqual(in vec3 a, in vec3 b) {

    return 1.0 - abs(sign(dot(a,a) - dot(b,b)));

}

void main() {   

    vec4 pointA = texture2D(_Position, vUv); // w component determines if point is pinned
    vec2 pointBCoord = mix(vUv + _Offset, vUv - _Offset, isEqual(pointA, pointB));
    vec3 pointB = texture2D(_Position, pointBCoord);

    vec3 dir = pointB.xyz - pointA.xyz;
    float dist = length(dir);

    if(dist <= 0.0) dist = 0.000001; //prevent division by 0

    float diff = (_RestLength - dist) / dist;

    pointA.xyz -= dir * 0.5 * ;

    gl_FragColor = vec4(pointA);

}