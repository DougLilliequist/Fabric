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
  Vec3
} from "../../../vendor/ogl/src/math/Vec3.js"; 

const vertex = require("./shader/verlet.vert");
const fragment = require("./shader/verlet.frag");

export class Verlet extends Mesh {
  constructor(gl) {
    super(gl);

    this.gl = gl;
    
    this.init();
    this.initGeometry();
    this.initProgram();

    // this.mode = this.gl.POINTS;

  }

  init() {
    
    this.timestep = 18.0 / 1000.0 //I suppose this is hardcoded delta time, from what I could gather from logging delta time
    this.timeStepSQ = this.timestep * this.timestep;
    this.windForce = new Vec3(0.0, 0.0, 0.0);
    this.forceDir = new Vec3(0.0, 0.0, 0.0);
    // this.gravity = new Vec3(0.0, -0.0005, 0.0);
    this.gravity = new Vec3(0.0, 0, 0.0);
    this.t = 0;

    this.attractionPoint = new Vec3(0,0,0);

    this.simulationThread = new Worker('./threads/simulationThread.js');

  }

  initGeometry() {
    this.widthSegments = 19;
    this.heightSegments = 19;

    this.geometry = new Plane(this.gl, {
      width: 7,
      height: 7,
      widthSegments: this.widthSegments,
      heightSegments: this.heightSegments
    });

    const {position, index} = this.geometry.attributes;

    const inputGeoAttribData = {
      position: position.data.slice(),
      index: index.data.slice()
    }

    this.simulationThread.postMessage(["init", {
      inputGeoAttribData,
      widthSegments: this.widthSegments, 
      heightSegments: this.heightSegments}]);

      this.simulationThread.onmessage = (event) => {

        this.updateGeometry(event.data);

      }

  }

  initProgram() {
    const uniforms = {};

    this.program = new Program(this.gl, {
      vertex,
      fragment,
      // uniforms,
      cullFace: null
    });
  }

  updateForces({
    t
  }) {

    this.t += t;
    let windStrength = (Math.sin(this.t + 2.0) + Math.sin(10.0 + this.t * 0.5) + Math.sin(0.1 + this.t * 0.7)) / 3.0;
    windStrength *= 10.5;
    // const windForceX = Math.cos(this.t * 0.3) * Math.cos(this.t * 1.0);
    // const windForceY = Math.sin(100 + this.t * 1.0);
    // const windForceZ = Math.cos(this.t * 0.5) * Math.sin(this.t * 1.0);

    const windForceX = Math.cos(this.t * 0.7);
    const windForceY = Math.sin(this.t * 0.1);
    const windForceZ = Math.cos(this.t * 0.4);

    const sphereOffsetX = Math.cos(this.t * 1.0) * 0.1;
    const sphereOffsetY = Math.sin(this.t * 0.5) * 0.5;
    const sphereOffsetZ = Math.sin(this.t * 1.0) * 0.1;

    this.windForce.set(sphereOffsetX, sphereOffsetY, sphereOffsetZ);
    this.windForce.normalize().multiply(windStrength).multiply(this.timeStepSQ);

  }

  updateGeometry(eventData) {

    const particles = eventData;

    particles.forEach((particle, i) => {
     
      this.geometry.attributes.position.data[i * 3 + 0] = particle.currentPos[0];
      this.geometry.attributes.position.data[i * 3 + 1] = particle.currentPos[1];
      this.geometry.attributes.position.data[i * 3 + 2] = particle.currentPos[2];

      this.geometry.attributes.normal.data[i * 3 + 0] = particle.normal[0];
      this.geometry.attributes.normal.data[i * 3 + 1] = particle.normal[1];
      this.geometry.attributes.normal.data[i * 3 + 2] = particle.normal[2];
    
    });

    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.normal.needsUpdate = true;
  }

  update({
    t,
    isInteracting
  }) {

    if(isInteracting) {
      this.attractionPoint.copy(this.hit.point)
    }
    
    this.updateForces({
      t
    });

    this.simulationThread.postMessage(["simulate", {
      windForce: this.windForce,
      attractionPoint: this.attractionPoint,
      isInteracting
    }]);

  }

}