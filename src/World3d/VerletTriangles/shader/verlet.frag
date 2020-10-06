precision highp float;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPos;

#define LIGHT vec3(0.0, 0.5, 1.0)

void main() {

    vec3 normal = (vNormal);
    
    float light = max(0.0, dot(normal, LIGHT));

    float hStripe = step(vUv.y, 0.5) + step(0.6, vUv.y);
    float vStripe = step(vUv.x, 0.3) + step(0.4, vUv.x);

    float crossShape = hStripe * vStripe;
    vec4 crossCol = mix(vec4(vec3(1.0), 0.5), vec4(0.2, 0.2, 0.95, 0.4), 1.0 - crossShape);
    crossCol *= mix(0.9,1.0, clamp(light, 0.0, 1.0));
    // vec3 col = mix(vec3(0.95), vec3(0.99), light);

    // gl_FragColor = vec4(normal*0.5+0.5, 1.0);
    // gl_FragColor = vec4(crossCol, mix(0.3, 1.0, 1.0 - crossShape));
    // gl_FragColor = vec4(vec3(1.0), 1.0);
    gl_FragColor = crossCol;

}