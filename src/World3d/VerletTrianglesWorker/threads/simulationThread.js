const { Vec3 } = require("../../../../vendor/ogl/src/math/Vec3");

self.onmessage = event => {

  const state = event.data[0];

  switch(state) {

    case "init": 
      init(event.data[1]);
    break;

    case "simulate": 
      simulate(event.data[1]);
    break;

    default: console.error("input event does not exist");
    break; 

  }

}

init = (eventData) => {

  self.timestep = 18.0 / 1000.0 //I suppose self is hardcoded delta time, from what I could gather from logging delta time
  self.timeStepSQ = self.timestep * self.timestep;
  self.windForce = new Vec3(0.0, 0.0, 0.0);
  self.forceDir = new Vec3(0.0, 0.0, 0.0);
  self.toAttractionPoint = new Vec3(0.0, 0.0, 0.0);
  // self.gravity = new Vec3(0.0, -0.0005, 0.0);
  self.gravity = new Vec3(0.0, 0, 0.0);
  self.t = 0;

  const {inputGeoAttribData, widthSegments, heightSegments} = eventData

  self.widthSegments = widthSegments;
  self.heightSegments = heightSegments;

  self.faces = []; //will be used for normals
  self.particles = [];
  self.sticks = [];

  const {
    position,
    index
  } = inputGeoAttribData;

  //have each vertex in the plane act as a particle that we apply physics to
  //and later update plane's local positions with the said data

  const topRightIndex = self.widthSegments;
  const topLeftIndex = 0;
  const bottomLeftIndex = (self.heightSegments + 1) * self.widthSegments;
  const bottomRightIndex = ((self.heightSegments + 1) * (self.widthSegments + 1) - 1.0);

  for (let i = 0; i < position.length / 3; i++) {
    let x = position[i * 3 + 0];
    let y = position[i * 3 + 1];
    let z = position[i * 3 + 2];

    let offsetX = Math.random() * 2.0 - 1.0;
    let offsetY = Math.random() * 2.0 - 1.0;
    let offsetZ = Math.random() * 2.0 - 1.0;

    self.particles.push({
      currentPos: new Vec3(x, y, z),
      prevPos: new Vec3(x + offsetX * 0, y + offsetY * 0, z + offsetZ * 0),
      tmpPos: new Vec3(0.0, 0.0, 0.0),
      delta: new Vec3(0.0, 0.0, 0.0),
      normal: new Vec3(0.0, 0.0, 0.0),
      acc: new Vec3(0.0, 0.0, 0.0),
      // pinned: false
      pinned: i === topLeftIndex || i === topRightIndex || i === bottomRightIndex || i === bottomLeftIndex ? true : false //the conditions assumes index points at vertices that are on top row
      // pinned: i === topLeftIndex || i === topRightIndex ? true : false //the conditions assumes index points at vertices that are on top row
      // pinned: i === topLeftIndex ? true : false //the conditions assumes index points at vertices that are on top row
      // pinned: false //the conditions assumes index points at vertices that are on top row
    });
  }

  self.cb = new Vec3(0.0, 0.0, 0.0);
  self.ab = new Vec3(0.0, 0.0, 0.0);

  //compute faces
  for (let i = 0; i < index.length; i += 3) {

    const indexA = index[i];
    const indexB = index[i + 1];
    const indexC = index[i + 2];

    self.faces.push({
      a: indexA,
      b: indexB,
      c: indexC,
    })

  }

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
  for (let y = 0; y < self.heightSegments + 1; y++) {
    indexOffset = y * (self.heightSegments + 1);

    for (let x = 0; x < self.widthSegments; x++) {
      let index = x + indexOffset;

      const pointA = self.particles[index].currentPos;
      const pointB = self.particles[index + 1].currentPos;
      const restLength = pointB.distance(pointA);

      self.sticks.push({
        pointA: index,
        pointB: index + 1,
        delta: new Vec3(0.0, 0.0, 0.0),
        restLength
      });
    }
  }

  //vertical sticks
  indexOffset = 0;
  for (let x = 0; x < self.widthSegments + 1; x++) {
    indexOffset = x * self.widthSegments;

    for (let y = 0; y < self.heightSegments; y++) {
      let index = y + indexOffset;
      const pointA = self.particles[index].currentPos;
      const pointB = self.particles[index + self.widthSegments + 1].currentPos;
      const restLength = pointB.distance(pointA);
      self.sticks.push({
        pointA: index,
        pointB: index + (self.widthSegments + 1),
        delta: new Vec3(0.0, 0.0, 0.0),
        restLength
      });
    }
  }

  updateNormals();
  postMessage(self.particles);

}

simulate = (eventData) => {

  const {windForce, isInteracting, attractionPoint} = eventData;

  // applyWindForce({windForce});

  applyVerlet();
  applyConstraints();
  if(isInteracting) applyInputForce({attractionPoint});  
  updateNormals();
  postMessage(self.particles);

}

applyInputForce = ({attractionPoint}) => {

    const minDistSq = 0.1 * 0.1;
    console.log(attractionPoint)
    self.particles.forEach((particle) => {

      self.toAttractionPoint.set(attractionPoint[0], attractionPoint[1], attractionPoint[2]).sub(particle.currentPos);
      const distSq = self.toAttractionPoint.squaredLen();
      if(distSq < minDistSq) {
        console.log(self.toAttractionPoint)
        particle.currentPos.add((self.toAttractionPoint).normalize() * 0.5);

      }

    });

}

applyWindForce = ({windForce}) => {

  self.particles.forEach((particle) => {

    self.forceDir.copy(particle.normal).normalize().multiply(particle.normal.dot(windForce));
    particle.acc.add(self.forceDir);
    particle.acc.add(self.gravity);

  });
  
}

applyVerlet = () => {
    for (let i = 0; i < self.particles.length; i++) {
      const particle = self.particles[i];
      if (particle.pinned) continue;
      particle.tmpPos.copy(particle.currentPos);
      particle.delta.sub(particle.currentPos, particle.prevPos);
      particle.delta.multiply(1.0);
      particle.currentPos.add(particle.delta);
      particle.currentPos.add(particle.acc);
      particle.prevPos.copy(particle.tmpPos);
      particle.acc.multiply(0.0);

    }
  }

  applyConstraints = () => {
    for (let i = 0; i < self.sticks.length; i++) {
      const stick = self.sticks[i];
      // let delta = self.particles[stick.pointB].currentPos.clone().sub(self.particles[stick.pointA].currentPos);
      stick.delta.sub(self.particles[stick.pointB].currentPos, self.particles[stick.pointA].currentPos);
      let distSq = stick.delta.squaredLen();
      //let dist = stick.delta.len();
      if (distSq === 0.0) continue;
      //we don't want to divide by 0...
      // let percentage = dist / (dist + (stick.restLength * stick.restLength));
      //let percentage = (stick.restLength - dist) / dist; //dist should be equal to rest length when "restored"
      let percentage = (stick.restLength * stick.restLength) / (distSq + (stick.restLength * stick.restLength)); //the correct way of using squared numbers
      percentage -= 0.5;
      stick.delta.multiply(percentage);
      if (self.particles[stick.pointA].pinned === false) {
        self.particles[stick.pointA].currentPos.sub(stick.delta);
      }

      if (self.particles[stick.pointB].pinned === false) {
        self.particles[stick.pointB].currentPos.add(stick.delta);
      }
    }
  }

  //based on: https://www.iquilezles.org/www/articles/normals/normals.htm
  //used on THREE's example, but instead of creating new vectors, I simply reset
  //the normal to 0, accumleate the normal and normalize

  updateNormals = () => {

    self.particles.forEach((particle) => {

      particle.normal.multiply(0);

    });

    self.faces.forEach((face) => {

      const a = self.particles[face.a].currentPos;
      const b = self.particles[face.b].currentPos;
      const c = self.particles[face.c].currentPos;

      self.cb.sub(c, b);
      self.ab.sub(a, b);
      self.cb.cross(self.ab);

      self.particles[face.a].normal.add(self.cb);
      self.particles[face.b].normal.add(self.cb);
      self.particles[face.c].normal.add(self.cb);

    });

    self.particles.forEach((particle) => {

      particle.normal.normalize();

    });

  }


