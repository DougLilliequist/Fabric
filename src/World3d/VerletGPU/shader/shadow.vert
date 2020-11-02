precision highp float;

attribute vec2 position;
attribute vec2 uv;

uniform sampler2D _Positions;
uniform sampler2D _Normals;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 modelMatrix;

uniform float _Size;

vec2 getCenterTexel(vec2 coord, vec2 offset) {

    return ((floor(coord * _Size) + 0.5) / (_Size)) + offset;

}

void main() {

    vec3 pos = texture2D(_Positions, (position + vec2(0.0))).xyz;
    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);

    gl_Position = projectionMatrix * mvPos;

}