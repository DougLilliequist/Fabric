precision highp float;

attribute vec2 position;
attribute vec2 uv;

uniform sampler2D _Positions;
uniform sampler2D _Normals;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 modelMatrix;
uniform mat3 normalMatrix;

uniform mat4 shadowProjectionMatrix;
uniform mat4 shadowViewMatrix;

uniform float _Flip;

varying vec2 vUv;
// varying vec3 vNormal;
varying vec3 vPos;
varying vec3 vNormal;
varying vec4 vShadowCoord;

uniform float _Size;

vec2 getCenterTexel(vec2 coord, vec2 offset) {

    return ((floor(coord * _Size) + 0.5) / (_Size)) + offset;

}


// vec2 getCenterTexel(vec2 coord, vec2 offset) {

//     return ((floor(coord+offset) * _Size) + 0.5) / _Size;

// }


void main() {

    // vec3 worldPosition = texture2D(_Position, worldPosition.xy).xyz;

    // vec4 modelViewPos = modelViewMatrix * vec4(worldPosition, 1.0);
    // modelViewPos.xy += position.xy * 0.1;

    vec3 pos = texture2D(_Positions, getCenterTexel(position, vec2(0.0))).xyz;
    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    vec3 norm = texture2D(_Normals, getCenterTexel(position, vec2(0.0))).xyz;

    vShadowCoord = shadowProjectionMatrix * shadowViewMatrix * vec4(pos, 1.0);

    gl_Position = projectionMatrix * mvPos;
    vUv = uv;
    vPos = pos.xyz;
    vNormal = norm * _Flip;

}