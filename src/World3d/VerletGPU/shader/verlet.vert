precision highp float;

attribute vec2 position;
attribute vec2 uv;

uniform sampler2D _Positions;
uniform sampler2D _Normals;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 modelMatrix;
uniform mat3 normalMatrix;

varying vec2 vUv;
// varying vec3 vNormal;
varying vec3 vPos;
varying vec3 vNormal;

void main() {

    // vec3 worldPosition = texture2D(_Position, worldPosition.xy).xyz;

    // vec4 modelViewPos = modelViewMatrix * vec4(worldPosition, 1.0);
    // modelViewPos.xy += position.xy * 0.1;

    vec3 pos = texture2D(_Positions, position).xyz;
    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    vec3 norm = texture2D(_Normals, position).xyz;

    gl_Position = projectionMatrix * mvPos;
    vUv = uv;
    vPos = mvPos.xyz;
    vNormal = norm;

}