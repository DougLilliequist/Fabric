precision highp float;

uniform sampler2D _Position;

attribute vec2 worldPosition;
attribute vec3 position;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 modelMatrix;

varying vec2 vUv;

void main() {

    vec3 worldPosition = texture2D(_Position, worldPosition.xy).xyz;

    vec4 modelViewPos = modelViewMatrix * vec4(worldPosition, 1.0);
    modelViewPos.xy += position.xy * 0.1;

    gl_Position = projectionMatrix * modelViewPos;

    vUv = uv;

}