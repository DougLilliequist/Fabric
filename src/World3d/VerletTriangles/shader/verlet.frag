precision highp float;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPos;

#define LIGHT vec3(0.0, 0.8, 1.0)

void main() {

    vec3 normal = (vNormal);
    
    float light = max(0.0, dot(normal, LIGHT));

    float hStripe = step(vUv.y, 0.4) + step(0.5, vUv.y);
    float vStripe = step(vUv.x, 0.4) + step(0.5, vUv.x);

    float crossShape = hStripe * vStripe;
    vec3 crossCol = mix(vec3(0.4, 0.4, 1.0), mix(vec3(0.92), vec3(0.98), light), crossShape);
    // vec4 crossCol = mix(vec4(1.0), vec4(0.2, 0.2, 0.95, 0.4), 1.0 - crossShape);
    // crossCol *= mix(0.98,1.0, clamp(light, 0.0, 1.0));
    // vec3 col = mix(vec3(0.95), vec3(0.99), light);

    // gl_FragColor = vec4(normal*0.5+0.5, 1.0);
    // gl_FragColor = vec4(crossCol, mix(0.3, 1.0, 1.0 - crossShape));
    // gl_FragColor = vec4(crossCol, 1.0);
    // gl_FragColor = vec4(crossCol, light);
    // gl_FragColor = vec4(mix(vec3(0.9,0.451,0.2858742), vec3(0.54534, 0.15345, 0.9983549), light), 1.0);
    // gl_FragColor = vec4(mix(vec3(0.3,0.851,0.8858742), vec3(0.54534, 0.15345, 0.9983549), light), mix(0.25, 1.0, light));
    // gl_FragColor = vec4(vec3(mix(1.0, 0.96, crossShape)), mix(0.1, 1.0, light));
    gl_FragColor = vec4(crossCol, 1.0);

}