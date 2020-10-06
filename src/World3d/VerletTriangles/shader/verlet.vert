precision highp float;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 modelMatrix;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPos;

void main() {

    // vec3 worldPosition = texture2D(_Position, worldPosition.xy).xyz;

    // vec4 modelViewPos = modelViewMatrix * vec4(worldPosition, 1.0);
    // modelViewPos.xy += position.xy * 0.1;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = 5.0;
    vUv = uv;
    vNormal = normal;
    vPos = position;

}