precision highp float;

uniform sampler2D _Position;

attribute vec2 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 modelMatrix;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPos;

void main() {

    vec3 pos = texture2D(_Position, position.xy).xyz;

    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

    vNormal = normal;

}