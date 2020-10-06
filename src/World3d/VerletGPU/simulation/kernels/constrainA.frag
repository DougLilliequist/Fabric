precision highp float;

uniform sampler2D tMap;
uniform vec2 _Offset;
uniform float _TexelSize;
uniform float _RestLength; //works on uniform grid...
uniform vec2 _Size;

varying vec2 vUv;

float isEqual(in vec3 a, in vec3 b) {

    return 1.0 - abs(sign(dot(a,a) - dot(b,b)));

}

vec3 constrain(in vec3 a, in vec3 b) {

    // if(isEqual(a, b) >= 1.0) return vec3(0.0);
    vec3 dir = b.xyz - a.xyz;
    float dist = length(dir);
    float diff = dist <= 0.0 ? 0.0 : (_RestLength - dist) / dist;

    return dir * diff * 0.5;

}

void main() {   

    // // vec2 uv = (floor(vUv * _Size) + 0.5) / _Size;
    // // vec2 uv2 = (floor((vUv + _Offset) * _Size) + 0.5) / _Size;

    // vec2 uv = vUv;
    // // vec2 uv2 = vUv + _Offset;

    // vec4 currentPos = texture2D(tMap, uv); // w component determines if point is pinned
    // vec3 pointA = texture2D(tMap, uv - vec2(_TexelSize, 0.0)).xyz;
    // vec3 pointB = texture2D(tMap, uv + vec2(_TexelSize, 0.0)).xyz;
    // vec3 pointC = texture2D(tMap, uv - vec2(0.0, _TexelSize)).xyz;
    // vec3 pointD = texture2D(tMap, uv + vec2(0.0, _TexelSize)).xyz;

    // // vec3 constraint = vec3(0.0);
    // currentPos.xyz -= constrain(currentPos.xyz, pointA.xyz) * 0.1;
    // currentPos.xyz -= constrain(currentPos.xyz, pointB.xyz) * 0.1;
    // currentPos.xyz -= constrain(currentPos.xyz, pointC.xyz) * 0.1;
    // currentPos.xyz -= constrain(currentPos.xyz, pointD.xyz) * 0.1;     
    
    // // currentPos.xyz += constraint;
    // // pointA.xyz += constraint;

        // vec2 uv = (floor(vUv * _Size) + 0.5) / _Size;
    // vec2 uv2 = (floor((vUv + _Offset) * _Size) + 0.5) / _Size;

    // vec2 uv = vUv;
    // vec2 uv2 = vUv + _Offset;

    vec2 uv = (floor(vUv * _Size) + 0.5) / _Size;
    vec2 uv2 = (floor((vUv + _Offset) * _Size) + 0.5) / _Size;

    vec4 pointA = texture2D(tMap, uv); // w component determines if point is pinned
    vec3 pointB = texture2D(tMap, uv2).xyz;

    pointA.xyz += constrain(pointA.xyz, pointB.xyz) * 0.5;

    gl_FragColor = vec4(pointA);

}