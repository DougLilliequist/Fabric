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

import {Shadow} from '../../../vendor/ogl/src/extras/Shadow.js'

import {params} from '../../params.js';

import {Simulator} from './Simulator/index.js';
import { Camera } from "../../../vendor/ogl/src/core/Camera.js";

const vertex = require("./shader/verlet.vert");
const fragment = require("./shader/verlet.frag");
const shadowVertex = require('./shader/shadow.vert');
const shadowFragment = require('./shader/shadow.frag');

export class Verlet extends Mesh {
  constructor(gl) {
    super(gl);

    this.gl = gl;

    this.initGeometry();
    this.initProgram();
    this.initShadowPass();

    this.timestep = 18.0 / 1000.0 //I suppose this is hardcoded delta time, from what I could gather from logging delta time
    this.timeStepSQ = this.timestep * this.timestep;
    this.windForce = new Vec3(0.0, 0.0, 0.0);
    this.forceDir = new Vec3(0.0, 0.0, 0.0);
    // this.gravity = new Vec3(0.0, -0.0005, 0.0);
    this.gravity = new Vec3(0.0, 0, 0.0);
    this.t = 0;
    this.flipped = false;

    // this.mode = this.gl.POINTS;

  }

  initGeometry() {
    this.widthSegments = params.CLOTH.SIZE-1;
    this.heightSegments = params.CLOTH.SIZE-1;

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
      },
      _Flip: {
        value: 1.0
      },
      _Size: {
        value: params.CLOTH.SIZE
      },
      _RestLengths: {
        value: this.simulator.RestLengthsDiagonal
      },
      _ShadowTexelSize: {
        value: 1.0 / params.SHADOW.SIZE
      },
      _Bias: {
        value: params.SHADOW.BIAS
      }
    };

    this.program = new Program(this.gl, {
      vertex,
      fragment,
      uniforms,
      cullFace: this.gl.BACK,
      transparent: true
    });
  }

  initShadowPass() {

    this.shadowCamera = new Camera(this.gl, {
        near: 1.0,
        far: 30.0,
        left: -10.0,
        right: 10.0,
        top: 10.0,
        bottom: -10.0
    });


    this.shadowCamera.position.set(0.0, 20.0, 0.3);
    this.shadowCamera.lookAt([0.0, 0.0, 0.0]);

    this.shadowPass = new Shadow(this.gl, {light: this.shadowCamera, width: params.SHADOW.SIZE, height: params.SHADOW.SIZE});

    this.shadowPass.add({mesh: this, vertex: shadowVertex, fragment: shadowFragment});

    //clean this up
    this.depthProgram.uniforms._Positions = {value: this.simulator.Positions};
    this.depthProgram.uniforms._Normals = {value: this.simulator.Normals};
    this.depthProgram.uniforms._Size = {value: params.CLOTH.SIZE-1};

}

  update({
    t,
    isInteracting,
    inputWorldPos,
    scene
  }) {
    this.t += t;
    this.simulator.update(this.t, {
      isInteracting,
      inputWorldPos
    });

    this.shadowPass.render({scene});

  }

  FlipFace() {


    this.program.cullFace = this.flipped ? this.gl.FRONT : this.gl.BACK;
    this.program.uniforms._Flip.value = this.flipped ? -1.0 : 1.0;
    this.flipped = !this.flipped;

  }

}