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

import {Simulator} from './Simulator/index.js';

const vertex = require("./shader/verlet.vert");
const fragment = require("./shader/verlet.frag");

export class Verlet extends Mesh {
  constructor(gl) {
    super(gl);

    this.gl = gl;

    this.initGeometry();
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
    this.widthSegments = 63;
    this.heightSegments = 63;

    const width = 5.0;
    const height = 5.0;

    const refGeometry = new Plane(this.gl, {
      width,
      height,
      widthSegments: this.widthSegments,
      heightSegments: this.heightSegments
    });

    this.faces = []; //will be used for normals
    this.particles = [];
    this.sticks = [];

    const {
      position,
      uv,
      normal,
      index
    } = refGeometry.attributes;


    this.simulator = new Simulator(this.gl, {
      data: position.data,
      countX: this.widthSegments+1,
      countY: this.heightSegments+1,
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
      index: {
        data: index.data
      }
    });

  }

  initProgram() {
    const uniforms = {
      _Positions: {
        value: this.simulator.Positions
      },
      _Normals: {
        value: this.simulator.Normals
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