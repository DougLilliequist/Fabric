import {
    Mesh
} from "../../../vendor/ogl/src/core/Mesh.js";
import {
    Plane
} from "../../../vendor/ogl/src/extras/Plane.js";
import {
    Program
} from "../../../vendor/ogl/src/core/Program.js";

import {
    Simulation
} from './simulation/Simulation.js'
import {
    Geometry
} from "../../../vendor/ogl/src/core/Geometry.js";

const vertex = require("./shader/verlet.vert");
const fragment = require("./shader/verlet.frag");

export class Verlet extends Mesh {
    constructor(gl) {
        super(gl);

        this.gl = gl;

        const resolutionX = 32.0;
        const resolutionY = 32.0;

        this.simulation = new Simulation(this.gl, {
            width: resolutionX,
            height: resolutionY
        })

        const refGeometry = new Plane(this.gl, {
            width: 1,
            height: 1,
        });

        const {
            position,
            uv,
            index
        } = refGeometry.attributes;

        const localPositionData = position.data;
        const uvData = uv.data;
        const indexData = index.data;

        this.geometry = new Geometry(this.gl, {
            position: {
                size: 3,
                data: localPositionData
            },
            worldPosition: {
                instanced: 1,
                size: 2,
                data: this.simulation.positionSim.coords
            },
            uv: {
                size: 2,
                data: uvData
            },
            index: {
                data: indexData
            }
        })

        const uniforms = {

            _Position: {
                value: this.simulation.Position
            }

        }

        this.program = new Program(this.gl, {
            vertex,
            fragment,
            uniforms,
            cullFace: null
        });
    }

    update({
        t
    }) {

        this.simulation.update({
            t
        });
        this.program.uniforms._Position.value = this.simulation.Position

    }

}