precision highp float;

uniform sampler2D tMap;
uniform vec2 _Offset;
uniform float _RestLength; //works on uniform grid...
uniform vec2 _Size;

varying vec2 vUv;

float isEqual(in vec3 a, in vec3 b) {

    return abs(sign(dot(a,a) - dot(b,b)));

}

vec3 constrain(in vec3 a, in vec3 b) {

    vec3 dir = b.xyz - a.xyz;
    float dist = length(dir);
    float diff = dist <= 0.0 ? 0.0 : (_RestLength - dist) / dist;

    return dir * diff * 0.5;

}

void main() {   

    // vec2 uv = (floor(vUv * _Size) + 0.5) / _Size;
    // vec2 uv2 = (floor((vUv + _Offset) * _Size) + 0.5) / _Size;

    vec2 uv = vUv;
    vec2 uv2 = vUv - _Offset;

    vec4 pointA = texture2D(tMap, uv); // w component determines if point is pinned
    vec3 pointB = texture2D(tMap, uv2).xyz;

    vec3 constraint = constrain(pointA.xyz, pointB.xyz);        
    
    pointA.xyz += constraint * 0.5;

    gl_FragColor = vec4(pointA);

}