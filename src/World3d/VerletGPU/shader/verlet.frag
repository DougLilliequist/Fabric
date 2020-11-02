precision highp float;

uniform samplerCube _CubeMap;
varying vec2 vUv;
varying vec3 vPos;

uniform sampler2D tShadow;
varying vec4 vShadowCoord;
uniform float _ShadowTexelSize;
uniform float _Bias;
uniform float _ShadowMapSize;

varying vec3 vNormal;
// varying vec3 vLight;
varying vec3 vEyeDir;

#define LIGHT vec3(0.0, 5.0, 2.3)

float unpackRGBA (vec4 v) {
    return dot(v, 1.0 / vec4(1.0, 255.0, 65025.0, 16581375.0));
}

// vec2 hash22(in vec2 p)
// {
// 	vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
//     p3 += dot(p3, p3.yzx+33.33);
//     return fract((p3.xx+p3.yz)*p3.zy);

// }

// float SoftShadow(in vec3 shadowCoord) {

//     //if particle is outside the shadowmap, then it's for sure not being occluded
//     if(shadowCoord.x < 0.0 || shadowCoord.x > 1.0) return 1.0;
//     if(shadowCoord.y < 0.0 || shadowCoord.y > 1.0) return 1.0;
//     if(shadowCoord.z < 0.0 || shadowCoord.z > 1.0) return 1.0;

//     float shadow = 9.0;
//     for(int y = -1; y <= 1; y++) {
//         for(int x = -1; x <= 1; x++) {

//             // vec2 hash = hash22((1000.0 * shadowCoord.xy) + vec2(float(x), float(y)));
//             // vec2 hash = hash22((10000.0 * shadowCoord.xy) + vec2(float(x), float(y))) * 2.0 - 1.0;
//             vec2 hash = hash22((10000.0 * shadowCoord.xy) + vec2(float(x), float(y))) - 0.5;
//             vec2 offset = (vec2(float(x), float(y)) + hash) / _ShadowMapSize;

//             float sampledShadow = unpackRGBA(texture2D(tShadow, shadowCoord.xy + offset));
//             if(shadowCoord.z - _Bias > sampledShadow) {
//                 shadow -= 1.0;
//             }

//         }
//     }

//     return shadow * (1.0/9.0);

// }

void main() {

    // vec3 normal = texture2D(_Normals, vUv).xyz;    
    vec3 normal = normalize(vNormal);    
    // float light = max(0.0, dot(normal, normalize(vLight)));

    // vec3 shadowCoord = vShadowCoord.xyz / vShadowCoord.w;
    // shadowCoord = shadowCoord * 0.5 + 0.5;
    // float shadow = SoftShadow(shadowCoord);

    // vec3 col = mix(vec3(0.8, 0.8, 0.8), vec3(1.0, 1.0, 1.0), light);
    // vec3 col = mix(vec3(0.7, 0.7, 0.7), vec3(1.0, 1.0, 1.0), light);

    vec3 reflectV = reflect(normalize(vEyeDir), normal);
    vec3 col = textureCube(_CubeMap, reflectV).xyz;
    // col *= mix(0.5, 1.0, shadow);
    // gl_FragColor = vec4(vNormal*0.5+0.5, 1.0);
    gl_FragColor = vec4(col, 1.0);

}