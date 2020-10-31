precision highp float;

// uniform sampler2D _Normals;
uniform sampler2D _RestLengths;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPos;

#define LIGHT vec3(0.0, 1.0, 0.3)

void main() {

    // vec3 normal = vNormal * 0.5 + 0.5;
    
    float light = max(0.0, dot(vNormal, normalize(LIGHT)));
    // vec3 col = vec3(0.9, 0.0, 0.0);
    vec3 col = mix(vec3(0.7, 0.7, 0.7), vec3(1.0, 1.0, 1.0), light);
    // vec3 col = mix(vec3(0.2, 0.465, 0.7), vec3(1.0, 1.0, 1.0), light); // interesting blue!
    // vec3 col = mix(vec3(0.2, 0.465, 0.7), vec3(0.2, 0.6, 0.845), light); // interesting blue!
    // gl_FragColor = vec4(vec3(vUv, 1.0), 1.0);

    vec3 restLengths = texture2D(_RestLengths, vUv).xyz;

    // gl_FragColor = vec4(vNormal * 0.5 + 0.5, 1.0);
    // gl_FragColor = vec4(vNormal * 0.5 + 0.5, 1.0);
    // gl_FragColor = vec4((vNormal*0.5+0.5), 1.0);
    // gl_FragColor = vec4(col, mix(0.8, 1.0, light));
    gl_FragColor = vec4(col, 1.0);

}