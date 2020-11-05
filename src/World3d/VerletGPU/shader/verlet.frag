precision highp float;

uniform samplerCube _CubeMap;

uniform vec3 cameraPosition;

varying vec3 vNormal;
varying vec3 vPos;
varying vec2 vUv;

void main() {

    vec3 normal = normalize(vNormal);    
    vec3 reflectV = reflect(normalize(vPos - cameraPosition), normal);
    vec3 col = textureCube(_CubeMap, reflectV).xyz;
    gl_FragColor = vec4(col, 1.0);

}