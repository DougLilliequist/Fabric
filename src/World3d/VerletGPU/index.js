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
  Geometry
} from "../../../vendor/ogl/src/core/Geometry.js";
import {
  Vec2
} from "../../../vendor/ogl/src/math/Vec2.js";
import {
  Vec3
} from "../../../vendor/ogl/src/math/Vec3.js";

import {
  Simulation
} from './simulation/Simulation.js'

const vertex = require("./shader/verlet.vert");
const fragment = require("./shader/verlet.frag");

export class Verlet extends Mesh {
  constructor(gl) {
    super(gl);

    this.gl = gl;

    this.initGeometry();
    // this.updateNormals();
    this.initProgram();

    this.timestep = 18.0 / 1000.0 //I suppose this is hardcoded delta time, from what I could gather from logging delta time
    this.timeStepSQ = this.timestep * this.timestep;
    this.windForce = new Vec3(0.0, 0.0, 0.0);
    this.forceDir = new Vec3(0.0, 0.0, 0.0);
    // this.gravity = new Vec3(0.0, -0.0005, 0.0);
    this.gravity = new Vec3(0.0, 0, 0.0);
    this.t = 0;

    // this.mode = this.gl.POINTS;

  }

  initGeometry() {

    this.widthSegments = 128;
    this.heightSegments = 128;

    const refGeometry = new Plane(this.gl, {
      width: 7,
      height: 7,
      widthSegments: this.widthSegments - 1,
      heightSegments: this.heightSegments - 1
    });

    const {
      position,
      uv,
      normal,
      index
    } = refGeometry.attributes;

    this.simulator = new Simulation(this.gl, {
      width: this.widthSegments,
      height: this.heightSegments,
      positionData: position.data
    });

    this.geometry = new Geometry(this.gl, {

      position: {
        size: 2,
        data: this.simulator.positionSim.coords
      },
      uv: {
        size: 2,
        data: uv.data
      },
      normal: {
        size: 3,
        data: normal.data
      },
      index: {
        data: index.data
      }

    });

  }

  initProgram() {
    const uniforms = {

      _Position: {
        value: this.simulator.Positions
      }

    };

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
    this.simulator.update();
  }
}