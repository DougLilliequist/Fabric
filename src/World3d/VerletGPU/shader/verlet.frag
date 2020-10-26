precision highp float;

// uniform sampler2D _Normals;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPos;

#define LIGHT vec3(0.0, 1.0, 0.0)

void main() {

    // vec3 normal = vNormal * 0.5 + 0.5;
    
    float light = max(0.0, dot((vNormal), LIGHT));
    // vec3 col = vec3(0.9, 0.0, 0.0);

    // gl_FragColor = vec4(vec3(vUv, 1.0), 1.0);
    // gl_FragColor = vec4(vNormal * 0.5 + 0.5, 1.0);
    // gl_FragColor = vec4(vNormal * 0.5 + 0.5, 1.0);
    gl_FragColor = vec4(vec3(light), 1.0);

}