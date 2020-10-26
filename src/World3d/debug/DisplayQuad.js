import { Texture } from "../../../vendor/ogl/src/core/Texture";

const { Mesh } = require("../../../vendor/ogl/src/core/Mesh");
const { Plane } = require("../../../vendor/ogl/src/extras/Plane");
const { Program } = require("../../../vendor/ogl/src/core/Program");

const vertex = require('./shader/quad.vert');
const fragment = require('./shader/quad.frag');
const { Vec2 } = require("../../../vendor/ogl/src/math/Vec2");

export class DisplayQuad extends Mesh {

    constructor(gl, {
        scale,
        aspect,
        position
    }) {

        super(gl);

        this.gl = gl;

        this.geometry = new Plane(this.gl, {
            width: 1.0,
            height: 1.0,
        });

        const uniforms = {

            _Texture: {

                value: new Texture(this.gl)

            },
            _Aspect: {
                value: window.innerWidth/window.innerHeight
            },
            _Scale: {
                value: scale
            },
            _ViewportPos: {
                value: position
            }

        }

        this.program = new Program(this.gl, {
            vertex,
            fragment,
            uniforms,
            depthTest: false,
            depthWrite: false
        });

    }

    get Texture() {
        return this.program.uniforms._Texture.value;
    }

    set Texture(t) {
        this.program.uniforms._Texture.value = t;
    }

}