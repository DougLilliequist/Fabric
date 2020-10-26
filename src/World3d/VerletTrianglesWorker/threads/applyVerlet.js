const applyVerlet = () => {
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];
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