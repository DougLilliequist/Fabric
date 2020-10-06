import { Mesh } from "../../../vendor/ogl/src/core/Mesh.js";
import { Plane } from "../../../vendor/ogl/src/extras/Plane.js";
import { Program } from "../../../vendor/ogl/src/core/Program.js";

import { Geometry } from "../../../vendor/ogl/src/core/Geometry.js";
import { Vec2 } from "../../../vendor/ogl/src/math/Vec2.js";
import { Vec3 } from "../../../vendor/ogl/src/math/Vec3.js";

const vertex = require("./shader/verlet.vert");
const fragment = require("./shader/verlet.frag");

export class Verlet extends Mesh {
  constructor(gl) {
    super(gl);

    this.gl = gl;

    this.initGeometry();
    this.updateNormals();
    this.initProgram();

    this.timestep = 18.0 / 1000.0; //I suppose this is hardcoded delta time, from what I could gather from logging delta time
    this.timeStepSQ = this.timestep * this.timestep;
    this.windForce = new Vec3(0.0, 0.0, 0.0);
    this.forceDir = new Vec3(0.0, 0.0, 0.0);
    this.windDir = new Vec3(0.0, 0.0, 0.0);
    // this.gravity = new Vec3(0.0, -0.0005, 0.0);
    this.gravity = new Vec3(0.0, -0.0008, 0.0);
    this.t = 0;

    //this.mode = this.gl.POINTS;
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

    this.faces = []; //will be used for normals
    this.particles = [];
    this.sticks = [];

    const { position, index } = this.geometry.attributes;

    //have each vertex in the plane act as a particle that we apply physics to
    //and later update plane's local positions with the said data

    const topRightIndex = this.widthSegments;
    const topLeftIndex = 0;
    const bottomLeftIndex = (this.heightSegments + 1) * this.widthSegments;
    const bottomRightIndex =
      (this.heightSegments + 1) * (this.widthSegments + 1) - 1.0;

    for (let i = 0; i < position.data.length / 3; i++) {
      let x = position.data[i * 3 + 0];
      let y = position.data[i * 3 + 1];
      let z = position.data[i * 3 + 2];

      let offsetX = Math.random() * 2.0 - 1.0;
      let offsetY = Math.random() * 2.0 - 1.0;
      let offsetZ = Math.random() * 2.0 - 1.0;

      this.particles.push({
        currentPos: new Vec3(x, y, z),
        prevPos: new Vec3(
          x + offsetX * 0.5,
          y + offsetY * 0.5,
          z + offsetZ * 0.5
        ),
        tmpPos: new Vec3(0.0, 0.0, 0.0),
        delta: new Vec3(0.0, 0.0, 0.0),
        normal: new Vec3(0.0, 0.0, 0.0),
        acc: new Vec3(0.0, 0.0, 0.0),
        // pinned: false
        // pinned:
        //   i === topLeftIndex ||
        //   i === topRightIndex ||
        //   i === bottomRightIndex ||
        //   i === bottomLeftIndex
        //     ? true
        //     : false //the conditions assumes index points at vertices that are on top row
        pinned: i === topLeftIndex || i === bottomLeftIndex ? true : false //the conditions assumes index points at vertices that are on top row
        // pinned: i === topLeftIndex ? true : false //the conditions assumes index points at vertices that are on top row
        // pinned: false //the conditions assumes index points at vertices that are on top row
      });
    }

    this.cb = new Vec3(0.0, 0.0, 0.0);
    this.ab = new Vec3(0.0, 0.0, 0.0);

    //compute faces
    for (let i = 0; i < index.data.length; i += 3) {
      const indexA = index.data[i];
      const indexB = index.data[i + 1];
      const indexC = index.data[i + 2];

      this.faces.push({
        a: indexA,
        b: indexB,
        c: indexC
      });
    }

    console.log(this.faces);

    //init sticks which contains neighbours on the vertical and horizontal axis
    //  0 - 1 - 2 - 3
    //  |   |   |   |
    //  4 - 5 - 6 - 7
    //  |   |   |   |
    //  8 - 9 - 10 -11
    //  |   |   |   |
    //  12 -13 -14 -15

    // horizontal sticks
    let indexOffset = 0;
    for (let y = 0; y < this.heightSegments + 1; y++) {
      indexOffset = y * (this.heightSegments + 1);

      for (let x = 0; x < this.widthSegments; x++) {
        let index = x + indexOffset;

        const pointA = this.particles[index].currentPos;
        const pointB = this.particles[index + 1].currentPos;
        const restLength = pointB.distance(pointA);

        this.sticks.push({
          pointA: index,
          pointB: index + 1,
          delta: new Vec3(0.0, 0.0, 0.0),
          restLength
        });
      }
    }

    //vertical sticks
    indexOffset = 0;
    for (let x = 0; x < this.widthSegments + 1; x++) {
      indexOffset = x * this.widthSegments;

      for (let y = 0; y < this.heightSegments; y++) {
        let index = y + indexOffset;
        const pointA = this.particles[index].currentPos;
        const pointB = this.particles[index + this.widthSegments + 1]
          .currentPos;
        const restLength = pointB.distance(pointA);
        this.sticks.push({
          pointA: index,
          pointB: index + (this.widthSegments + 1),
          delta: new Vec3(0.0, 0.0, 0.0),
          restLength
        });
      }
    }

    //add diagonal sticks as well
  }

  initProgram() {
    const uniforms = {};

    this.program = new Program(this.gl, {
      vertex,
      fragment,
      // uniforms,
      cullFace: null,
      transparent: true
    });
  }

  applyForces({ t }) {
    this.t += t;
    let windStrength =
      (Math.sin(this.t + 2.0) +
        Math.sin(10.0 + this.t * 5.5) +
        Math.sin(30.1 + this.t * 3.7)) /
      3.0;
    windStrength *= 10.0;
    // const windForceX = Math.cos(this.t * 0.3) * Math.cos(this.t * 1.0);
    // const windForceY = Math.sin(100 + this.t * 1.0);
    // const windForceZ = Math.cos(this.t * 0.5) * Math.sin(this.t * 1.0);

    const windForceX = Math.cos(this.t * 5.7);
    const windForceY = Math.sin(this.t * 5.1);
    const windForceZ = Math.cos(this.t * 5.4);

    const sphereOffsetX = Math.cos(this.t * 0.5) * Math.cos(this.t * 1.0) * 0.1;
    const sphereOffsetY = Math.sin(this.t * 0.5) * 0.1;
    const sphereOffsetZ = Math.cos(this.t * 0.5) * Math.sin(this.t * 1.0) * 0.1;

    const topRightIndex = this.widthSegments;
    const topLeftIndex = 0;
    const bottomLeftIndex = (this.heightSegments + 1) * this.widthSegments;
    const bottomRightIndex =
      (this.heightSegments + 1) * (this.widthSegments + 1) - 1.0;

    this.windDir
      .set(-0.1, 0.0, 2)
      .normalize()
      .multiply(0.002);

    // this.particles[topLeftIndex].acc.add(new Vec3(sphereOffsetX, sphereOffsetY, sphereOffsetZ).normalize().multiply(this.timeStepSQ * (50 * (Math.sin(this.t * 0.08) * 0.5 + 0.5))));

    //FROM PARTICLE VERSION
    // let windStrength = (Math.sin(this.t + 2.0) + Math.sin(10.0 + this.t * 0.5) + Math.sin(0.1 + this.t * 0.7)) / 3.0;
    // windStrength *= 10.0;
    // // const windForceX = Math.cos(this.t * 0.3) * Math.cos(this.t * 1.0);
    // // const windForceY = Math.sin(100 + this.t * 1.0);
    // // const windForceZ = Math.cos(this.t * 0.5) * Math.sin(this.t * 1.0);

    // const windForceX = Math.cos(this.t * 0.3);
    // const windForceY = Math.sin(100 + this.t * 8.0);
    // const windForceZ = Math.cos(this.t * 0.5);

    // const sphereOffsetX = Math.cos(this.t * 0.5) * Math.cos(this.t * 1.0);
    // const sphereOffsetY = Math.sin(this.t * 0.5);
    // const sphereOffsetZ = Math.cos(this.t * 0.5) * Math.sin(this.t * 1.0);

    // this.particles[0].currentPos.add(new Vec3(sphereOffsetX, sphereOffsetY, sphereOffsetZ).normalize().multiply(0.01 * (Math.sin(this.t * 0.1) * 0.5 + 0.5)));

    this.windForce.set(windForceX, windForceY, windForceZ);
    this.windForce
      .normalize()
      .multiply(windStrength)
      .multiply(this.timeStepSQ);

    this.particles.forEach(particle => {
      this.forceDir
        .copy(particle.normal)
        .normalize()
        .multiply(particle.normal.dot(this.windForce));
      particle.acc.add(this.forceDir);
      particle.acc.add(this.windDir);
      particle.acc.add(this.gravity);
    });
  }

  applyVerlet() {
    // this.particles.forEach(particle => {
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];
      if (particle.pinned) continue;
      // if (particle.pinned) return;
      particle.tmpPos.copy(particle.currentPos);
      particle.delta.sub(particle.currentPos, particle.prevPos);
      particle.delta.multiply(1);
      particle.currentPos.add(particle.delta);
      particle.currentPos.add(particle.acc);
      particle.prevPos.copy(particle.tmpPos);
      particle.acc.multiply(0.0);
    }
    // });
  }

  //constraints causes positions to speed into infinity (caused by incorrect handling of vectors...plus creating vectors on the fly made the fans spin up)
  //not entirely clear yet why specific vector needs to be added or subtracted, or rather: WHICH should be added / subtracted with delta
  applyConstraints() {
    // this.sticks.forEach(stick => {
    for (let i = 0; i < this.sticks.length; i++) {
      const stick = this.sticks[i];
      // let delta = this.particles[stick.pointB].currentPos.clone().sub(this.particles[stick.pointA].currentPos);
      stick.delta.sub(
        this.particles[stick.pointB].currentPos,
        this.particles[stick.pointA].currentPos
      );
      let distSq = stick.delta.squaredLen();
      //let dist = stick.delta.len();
      if (distSq === 0.0) continue;
      //we don't want to divide by 0...
      // let percentage = dist / (dist + (stick.restLength * stick.restLength));
      //let percentage = (stick.restLength - dist) / dist; //dist should be equal to rest length when "restored"
      let percentage =
        (stick.restLength * stick.restLength) /
        (distSq + stick.restLength * stick.restLength); //the correct way of using squared numbers
      percentage -= 0.5;
      stick.delta.multiply(percentage);
      if (this.particles[stick.pointA].pinned === false) {
        this.particles[stick.pointA].currentPos.sub(stick.delta);
      }

      if (this.particles[stick.pointB].pinned === false) {
        this.particles[stick.pointB].currentPos.add(stick.delta);
      }
    }
    // });
  }

  updateGeometry() {
    this.updateNormals();

    this.particles.forEach((particle, i) => {
      //toArray spreads each vector component from a given index in a exisiting array
      particle.currentPos.toArray(
        this.geometry.attributes.position.data,
        i * 3
      );
      particle.normal.toArray(this.geometry.attributes.normal.data, i * 3);
    });

    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.normal.needsUpdate = true;
  }

  //based on: https://www.iquilezles.org/www/articles/normals/normals.htm
  //used on THREE's example, but instead of creating new vectors, I simply reset
  //the normal to 0, accumleate the normal and normalize

  updateNormals() {
    this.particles.forEach(particle => {
      particle.normal.multiply(0);
    });

    this.faces.forEach(face => {
      const a = this.particles[face.a].currentPos;
      const b = this.particles[face.b].currentPos;
      const c = this.particles[face.c].currentPos;

      this.cb.sub(c, b);
      this.ab.sub(a, b);
      this.cb.cross(this.ab);

      this.particles[face.a].normal.add(this.cb);
      this.particles[face.b].normal.add(this.cb);
      this.particles[face.c].normal.add(this.cb);
    });

    this.particles.forEach(particle => {
      particle.normal.normalize();
    });
  }

  update({ t }) {
    this.applyForces({
      t
    });

    this.applyVerlet();
    this.applyConstraints();

    this.updateGeometry();
  }
}
