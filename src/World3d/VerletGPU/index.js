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
  Vec3
} from "../../../vendor/ogl/src/math/Vec3.js";

import {params} from '../../params.js';

import {Simulator} from './Simulator/index.js';
import { Texture } from "../../../vendor/ogl/src/core/Texture.js";

import cubemap from '../../../static/cubemap/*.jpg';

const vertex = require("./shader/verlet.vert");
const fragment = require("./shader/verlet.frag");

export class Verlet extends Mesh {
  constructor(gl) {
    super(gl);

    this.gl = gl;

    this.initGeometry();
    this.initProgram();
    // this.initShadowPass();

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
      countX: params.CLOTH.SIZE,
      countY: params.CLOTH.SIZE,
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

    this.cubeMapTexture = new Texture(this.gl, {
      target: this.gl.TEXTURE_CUBE_MAP,
    });

    this.loadCubeMap();

    const uniforms = {
      _Positions: {
        value: this.simulator.Positions
      },
      _Normals: {
        value: this.simulator.Normals
      },
      _Size: {
        value: params.CLOTH.SIZE
      },
      _CubeMap: {
        value: this.cubeMapTexture
      },
    };

    this.program = new Program(this.gl, {
      vertex,
      fragment,
      uniforms,
      cullFace: null,
      transparent: false
    });
  }

      async loadCubeMap() {

        function loadImage(src) {
            return new Promise(res => {

                const img = new Image();
                img.onload = () => res(img);
                img.src = src;

            });
        }

        const images = await Promise.all([
            loadImage(cubemap.posx),
            loadImage(cubemap.negx),
            loadImage(cubemap.posy),
            loadImage(cubemap.negy),
            loadImage(cubemap.posz),
            loadImage(cubemap.negz),
        ]);

        this.cubeMapTexture.image = images;

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

  }

  FlipFace() {


    this.program.cullFace = this.flipped ? this.gl.FRONT : this.gl.BACK;
    this.program.uniforms._Flip.value = this.flipped ? -1.0 : 1.0;
    this.flipped = !this.flipped;

  }

}