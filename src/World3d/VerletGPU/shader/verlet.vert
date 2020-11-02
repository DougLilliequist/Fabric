precision highp float;

attribute vec2 position;
attribute vec2 uv;

uniform sampler2D _Positions;
uniform sampler2D _Normals;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 modelMatrix;
uniform mat3 normalMatrix;
uniform mat4 viewMatrix;

// uniform mat4 shadowProjectionMatrix;
// uniform mat4 shadowViewMatrix;

uniform float _Flip;

varying vec2 vUv;
// varying vec3 vNormal;
varying vec3 vPos;
varying vec3 vNormal;
varying vec4 vShadowCoord;
varying vec3 vLight;
varying vec3 vEyeDir;

uniform float _Size;

#define LIGHT vec3(0.0, 5.0, 2.3)

void main() {

    vec3 pos = texture2D(_Positions, (position + vec2(0.0))).xyz;
    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    vec3 norm = texture2D(_Normals, (position + vec2(0.0))).xyz;

    gl_Position = projectionMatrix * mvPos;
    vUv = uv;
    vPos = pos.xyz;
    vEyeDir = mvPos.xyz;
    // vNormal = norm * _Flip;
    vNormal = normalMatrix * norm;
    // vLight = (viewMatrix * vec4(LIGHT, 1.0)).xyz;

}