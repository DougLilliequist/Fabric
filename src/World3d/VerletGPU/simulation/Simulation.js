import {
    GPGPU
} from '../../../../vendor/ogl/src/extras/GPGPU.js';

import {
    Texture
} from '../../../../vendor/ogl/src/core/Texture.js'
import {
    Vec2
} from '../../../../vendor/ogl/src/math/Vec2.js';

const velocityKernel = require('./kernels/velocity.frag');
const positionKernel = require('./kernels/position.frag');

const constrainAKernel = require('./kernels/constrainA.frag');
const constrainBKernel = require('./kernels/constrainB.frag');

export class Simulation {

    constructor(gl, {
        width = 2,
        height = 2,
        positionData
    }) {

        this.gl = gl;

        this.width = width;
        this.height = height;
        this.count = this.width * this.height;

        this.initVelocitySim();
        this.initPositionSim({
            positionData
        });
        // this.initConstraintSim();
        // this.prevWarm();

    }

    initVelocitySim() {

        const initVelocityData = new Float32Array(this.count * 4.0);

        this.velocitySim = new GPGPU(this.gl, {
            data: initVelocityData
        });

        const uniforms = {

            _Position: null,

            _PrevPosition: {
                value: null
            },
            _Force: {
                value: 0.01
            }

        }

        this.velocitySim.addPass({
            fragment: velocityKernel,
            uniforms
        })

    }

    initPositionSim({
        positionData
    }) {

        this.initPositionData = new Float32Array(this.count * 4.0);
        let initPositionDataIterator = 0;
        let positionDataIterator = 0;

        const texelSize = 1.0 / this.width;

        const topRightIndex = this.width;
        const topLeftIndex = 0;
        const bottomLeftIndex = (this.width + 1) * this.height;
        const bottomRightIndex = ((this.height + 1) * (this.width + 1) - 1.0);

        for (let i = 0; i < positionData.length / 3; i++) {
            let x = positionData[positionDataIterator++];
            let y = positionData[positionDataIterator++];
            let z = positionData[positionDataIterator++];
            let w = (i === topLeftIndex || i === bottomLeftIndex) ? 0.0 : 0.0 //the conditions assumes index points at vertices that are on top row
            // pinned: false
            // pinned: i === topLeftIndex || i === topRightIndex || i === bottomRightIndex || i === bottomLeftIndex ? true : false //the conditions assumes index points at vertices that are on top row
            // pinned: i === topLeftIndex ? true : false //the conditions assumes index points at vertices that are on top row

            this.initPositionData[initPositionDataIterator++] = x;
            this.initPositionData[initPositionDataIterator++] = y;
            this.initPositionData[initPositionDataIterator++] = z;
            this.initPositionData[initPositionDataIterator++] = w;

        };

        this.positionSim = new GPGPU(this.gl, {
            data: this.initPositionData
        });

        const uniforms = {
            _Velocity: this.velocitySim.uniform,
        }

        this.positionSim.addPass({
            fragment: positionKernel,
            uniforms
        });

        const constrainHorizontalUniforms = {

            _Offset: {
                value: new Vec2(texelSize, 0.0)
            },
            _TexelSize: {
                value: texelSize
            },
            _RestLength: {
                value: 0.36842
                // value: 0.368
            },
            _Size: {
                value: new Vec2(this.width, this.height)
            }

        }

        // const constrianVerticalUniforms = {

        //     _Offset: {
        //         value: new Vec2(0.0, texelSize)
        //     },
        //     _TexelSize: {
        //         value: texelSize
        //     },
        //     _RestLength: {
        //         value: 0.3684210777282715
        //     },
        //     _Size: {
        //         value: new Vec2(this.width, this.height)
        //     }

        // }

        //constrain on pointA
        this.positionSim.addPass({
            fragment: constrainAKernel,
            uniforms: {

                _Offset: {
                    value: new Vec2(-texelSize, 0.0)
                },
                _TexelSize: {
                    value: texelSize
                },
                _RestLength: {
                    value: 0.36842
                    // value: 0.368
                },
                _Size: {
                    value: new Vec2(this.width, this.height)
                }

            }
        });

        // constrain on pointB
        this.positionSim.addPass({
            fragment: constrainAKernel,
            uniforms: {

                _Offset: {
                    value: new Vec2(texelSize, 0.0)
                },
                _TexelSize: {
                    value: texelSize
                },
                _RestLength: {
                    value: 0.36842
                    // value: 0.368
                },
                _Size: {
                    value: new Vec2(this.width, this.height)
                }

            }
        });

        //constrain on pointA
        this.positionSim.addPass({
            fragment: constrainAKernel,
            uniforms: {

                _Offset: {
                    value: new Vec2(0.0, texelSize)
                },
                _TexelSize: {
                    value: texelSize
                },
                _RestLength: {
                    value: 0.36842
                    // value: 0.368
                },
                _Size: {
                    value: new Vec2(this.width, this.height)
                }

            }
        });


        // // constrain on pointB
        this.positionSim.addPass({
            fragment: constrainAKernel,
            uniforms: {

                _Offset: {
                    value: new Vec2(0.0, -texelSize)
                },
                _TexelSize: {
                    value: texelSize
                },
                _RestLength: {
                    value: 0.36842
                    // value: 0.368
                },
                _Size: {
                    value: new Vec2(this.width, this.height)
                }

            }
        });

    }

    createDataTexture({
        data,
        size
    }) {

        return new Texture(this.gl, {
            image: data,
            target: this.gl.TEXTURE_2D,
            type: this.gl.FLOAT,
            format: this.gl.RGBA,
            internalFormat: this.gl.renderer.isWebgl2 ? this.gl.RGBA32F : this.gl.RGBA,
            wrapS: this.gl.CLAMP_TO_EDGE,
            wrapT: this.gl.CLAMP_TO_EDGE,
            generateMipmaps: false,
            minFilter: this.gl.NEAREST,
            magFilter: this.gl.NEAREST,
            width: size,
            flipY: false
        })

    }

    prevWarm() {

        const prevPositionsData = new Float32Array(this.count * 4.0);

        let prevPositionsIterator = 0;
        let posIterator = 0;

        for (let y = 0; y < this.count; y++) {

            let offsetX = Math.random() * 2.0 - 1.0;
            let offsetY = Math.random() * 2.0 - 1.0;
            let offsetZ = Math.random() * 2.0 - 1.0;

            prevPositionsData[prevPositionsIterator++] = this.initPositionData[posIterator++] + (offsetX * 0.00001);
            prevPositionsData[prevPositionsIterator++] = this.initPositionData[posIterator++] + (offsetY * 0.00001);
            prevPositionsData[prevPositionsIterator++] = this.initPositionData[posIterator++] + (offsetZ * 0.00001);
            prevPositionsData[prevPositionsIterator++] = this.initPositionData[posIterator++];

        }

        const prevPositions = this.createDataTexture({
            data: prevPositionsData,
            size: this.width
        });

        const activeVelocitySimPass = this.velocitySim.passes[0];
        activeVelocitySimPass.program.uniforms._Position = this.positionSim.uniform;
        activeVelocitySimPass.program.uniforms._PrevPosition.value = prevPositions;
        this.velocitySim.render();

        this.positionSim.render();

    }

    update() {

        const activeVelocitySimPass = this.velocitySim.passes[0];
        activeVelocitySimPass.program.uniforms._Position = this.positionSim.uniform;
        activeVelocitySimPass.program.uniforms._PrevPosition.value = this.positionSim.fbo.write.texture;
        this.velocitySim.render();

        // const activePositionSimPass = this.positionSim.passes[0];
        // activePositionSimPass.program.uniforms._Velocity = this.velocitySim.uniform;
        this.positionSim.render();

    }

    get Positions() {

        return this.positionSim.fbo.read.texture;

    }

    get Velocities() {
        return this.velocitySim.fbo.read.texture;
    }

}