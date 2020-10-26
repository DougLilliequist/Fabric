precision highp float;

attribute vec3 position;
attribute vec2 uv;

uniform float _Aspect;
uniform float _Scale;
uniform vec2 _ViewportPos;

varying vec2 vUv;

void main() {

    vec3 localPos = position;
    localPos.x /= _Aspect;
    localPos *= _Scale;
    vec2 finalPos = _ViewportPos + localPos.xy;

    vUv = uv;

    gl_Position = vec4(finalPos.xy, 0.0, 1.0);

}