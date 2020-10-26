const updateNormals = () => {

    this.particles.forEach((particle) => {

      particle.normal.multiply(0);

    });

    this.faces.forEach((face) => {

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

    this.particles.forEach((particle) => {

      particle.normal.normalize();

    });

  }

