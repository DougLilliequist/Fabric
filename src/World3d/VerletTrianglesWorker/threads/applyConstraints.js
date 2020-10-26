const applyConstraints = () => {
    for (let i = 0; i < this.sticks.length; i++) {
      const stick = this.sticks[i];
      // let delta = this.particles[stick.pointB].currentPos.clone().sub(this.particles[stick.pointA].currentPos);
      stick.delta.sub(this.particles[stick.pointB].currentPos, this.particles[stick.pointA].currentPos);
      let distSq = stick.delta.squaredLen();
      //let dist = stick.delta.len();
      if (distSq === 0.0) continue;
      //we don't want to divide by 0...
      // let percentage = dist / (dist + (stick.restLength * stick.restLength));
      //let percentage = (stick.restLength - dist) / dist; //dist should be equal to rest length when "restored"
      let percentage = (stick.restLength * stick.restLength) / (distSq + (stick.restLength * stick.restLength)); //the correct way of using squared numbers
      percentage -= 0.5;
      stick.delta.multiply(percentage);
      if (this.particles[stick.pointA].pinned === false) {
        this.particles[stick.pointA].currentPos.sub(stick.delta);
      }

      if (this.particles[stick.pointB].pinned === false) {
        this.particles[stick.pointB].currentPos.add(stick.delta);
      }
    }
  }