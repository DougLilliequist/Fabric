precision highp float;

attribute vec2 position;
attribute vec2 uv;

uniform sampler2D _Positions;
uniform sampler2D _Normals;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat3 normalMatrix;

varying vec2 vUv;
varying vec3 vPos;
varying vec3 vNormal;

uniform float _Size;

#define LIGHT vec3(0.0, 5.0, 2.3)

void main() {

    vec3 pos = texture2D(_Positions, (position + vec2(0.0))).xyz;
    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    vec3 norm = texture2D(_Normals, (position + vec2(0.0))).xyz;

    gl_Position = projectionMatrix * mvPos;
    vUv = uv;
    vPos = pos.xyz;
    vNormal = normalMatrix * norm;

}