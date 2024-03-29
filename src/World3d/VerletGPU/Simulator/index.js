import { Program } from "../../../../vendor/ogl/src/core/Program";
import { Vec2 } from "../../../../vendor/ogl/src/math/Vec2";
import { Texture } from "../../../../vendor/ogl/src/core/Texture";
import { Vec3 } from "../../../../vendor/ogl/src/math/Vec3";
const { GPGPU } = require("../../../../vendor/ogl/src/extras/GPGPU");

const prevPosKernel = require('./kernels/prevPos.frag');
const currentPosKernel = require('./kernels/currentPos.frag');
const positionKernel = require('./kernels/position.frag');
const normalKernel = require('./kernels/calcNormal.frag');

const restlengthKernel = require('./kernels/restLength.frag');
const restLengthDiagonalKernel = require('./kernels/restLengthDiagonal.frag');

const constrainHorizontalKernel = require('./kernels/constrainHorizontal.frag');
const constrainVerticalKernel = require('./kernels/constrainVertical.frag');
const constrainBLTRKernel = require('./kernels/constrainBLTR.frag');
const constrainBRTLKernel = require('./kernels/constrainBRTL.frag');

import {params} from '../../../params.js';

export class Simulator {

    constructor(gl, {
        data,
        countX,
        countY,
    }) {

        this.gl = gl;

        this.data = data;

        this.countX = countX;
        this.countY = countY;

        this.initSimulators();
        this.initPrograms();
        this.prewarm();

    }

    initSimulators() {

        this.positionData = new Float32Array(this.countX*this.countY*4);
        let positionDataIterator = 0;
        let origDataIterator = 0;
        
        for(let y = 0; y < this.countY; y++) {
            
            for(let x = 0; x < this.countX; x++) {

                this.positionData[positionDataIterator++] = this.data[origDataIterator++];
                this.positionData[positionDataIterator++] = this.data[origDataIterator++];
                this.positionData[positionDataIterator++] = this.data[origDataIterator++];
                
                let corner = 0;

                let isTopLeft = y === 0 && x === 0;
                let isTopRight = y === 0 && x === this.countX - 1;
                let isBottomLeft = y === this.countY-1 && x === this.countX -1;
                let isBottomRight = y === this.countY-1 && x === 0;

                if(isTopLeft) corner = 1;
                if(isTopRight) corner = 2;
                if(isBottomLeft) corner = 3;
                if(isBottomRight) corner = 4;
               
                this.positionData[positionDataIterator++] = corner;

            }

        }

        this.currentPosCapture = new GPGPU(this.gl, {
            data: this.positionData,
            type: this.gl.FLOAT
        });

        const prevPositionData = this.positionData.slice();
        let prevPosIterator = 0;
        origDataIterator = 0;
        let twoPI = Math.PI * 2;
            
            for(let x = 0; x < this.countX*this.countY; x++) {

                let offsetx = Math.random() * 2.0 - 1.0;
                let offsety = Math.random() * 2.0 - 1.0;
                let offsetz = Math.random() * 2.0 - 1.0;

                // let offsetx = Math.cos(angleX) * Math.cos(angleX);
                // let offsety = Math.sin(angleY);
                // let offsetz = Math.cos(angleZ) * Math.sin(angleZ); 

                prevPositionData[prevPosIterator++] += (offsetx*0.01);
                prevPositionData[prevPosIterator++] += (offsety*0.01);
                prevPositionData[prevPosIterator++] += (offsetz*0.01);
                prevPositionData[prevPosIterator++] += 0.0;

        }

        this.prevPositionCapture = new GPGPU(this.gl, {
            data: prevPositionData,
            type: this.gl.FLOAT
        });

        this.positionSim = new GPGPU(this.gl, {
            data: this.positionData,
            type: this.gl.FLOAT,
            // filtering: this.gl.N
        });

        const normalData = new Float32Array(this.countX*this.countY*4.0);
        let normalIterator = 0;
        
        for(let i = 0; i < this.countX*this.countY; i++) {

            normalData[normalIterator++] = 0.0;
            normalData[normalIterator++] = 0.0;
            normalData[normalIterator++] = -1.0;
            normalData[normalIterator++] = 1.0;

        }

        this.normalSim = new GPGPU(this.gl, {
            data: normalData,
            type: this.gl.FLOAT,
            // filtering: this.gl.LINEAR
        });

        this.restlengthCapture = new GPGPU(this.gl, {
            data: new Float32Array(this.countX*this.countY*4),
            type: this.gl.FLOAT
        });

        this.restlengthDiagonalCapture = new GPGPU(this.gl, {
            data: new Float32Array(this.countX*this.countY*4),
            type: this.gl.FLOAT
        });
        
        this.constraintSim = new GPGPU(this.gl, {
            data: this.positionData,
            type: this.gl.FLOAT
        });

    }

    initPrograms() {

        const restlengthCaptureU = {
            _InitPos: this.positionSim.uniform,
            _Size: {
                value: params.CLOTH.SIZE
              },
        }

        this.restlengthCapture.addPass({
            fragment: restlengthKernel,
            uniforms: restlengthCaptureU
        });

        const restlengthDiagonalU = {
            _InitPos: this.positionSim.uniform,
            _Size: {
                value: params.CLOTH.SIZE
              },
        }

        this.restlengthDiagonalCapture.addPass({
            fragment: restLengthDiagonalKernel,
            uniforms: restlengthDiagonalU
        });

        const normalSimU = {
            _Position: this.positionSim.uniform,
            _Size: {
                value: params.CLOTH.SIZE
              },
        }

        this.normalSim.addPass({
            fragment: normalKernel,
            uniforms: normalSimU
        });

        const positionSimU = {
            _PrevPos: this.prevPositionCapture.uniform,
            _CurrentPos: this.currentPosCapture.uniform,
            _Normal: this.normalSim.uniform,
            _Force: {
                value: new Vec3(0.0, 0.0, 0.0)
            },
            _Time: {
                value: 0.0
            },
            _InputWorldPos: {
                value: new Vec3(0.0,0.0,0.0)
            },
            _IsInteracting: {
                value: false
            },
            _Corner: {
                value: 0
            },
            _Size: {
                value: params.CLOTH.SIZE
              },
        }

        this.positionSim.addPass({
            fragment: positionKernel,
            uniforms: positionSimU
        });

        const prevPosCaptureSimU = {
            _Positions: this.currentPosCapture.uniform,
            _Size: {
                value: params.CLOTH.SIZE
              },
        }

        this.prevPositionCapture.addPass({
            fragment: prevPosKernel,
            uniforms: prevPosCaptureSimU
        });

        const currentPosCaptureSimU = {
            _Positions: this.positionSim.uniform,
            _Size: {
                value: params.CLOTH.SIZE
              },
        }

        this.currentPosCapture.addPass({
            fragment: currentPosKernel,
            uniforms: currentPosCaptureSimU
        });

        //MAKE A SINGLE UNIFORM OR FUNCTION THAT RETURNS A UNIFORM WITH DESIRED PARAMS

        // const constrainHorizontalFirstPassU = {
        //     _TexelSize: {
        //         value: new Vec2(1.0 / this.countX, 1.0 / this.countY)
        //     },
        //     _Stiffness: {
        //         value: params.PHYSICS.STIFFNESS
        //     },
        //     _Flip: {
        //         value: 0.0
        //     },
        //      _RestLength: this.restlengthCapture.uniform,
        //      _Clamp: {
        //          value: params.PHYSICS.CLAMP
        //      },
        //      _Size: {
        //         value: params.CLOTH.SIZE
        //       },
        // }
        
        // const constrainHorizontalSecondPassU = {
        //     _TexelSize: {
        //         value: new Vec2(1.0 / this.countX, 1.0 / this.countY)
        //     },
        //     _Stiffness: {
        //         value: params.PHYSICS.STIFFNESS
        //     },
        //     _Flip: {
        //         value: 1.0
        //     },
        //     _RestLength: this.restlengthCapture.uniform,
        //     _Clamp: {
        //         value: params.PHYSICS.CLAMP
        //     },
        //     _Size: {
        //         value: params.CLOTH.SIZE
        //       },

        // }
        
        // const constrainVerticalFirstPassU = {
        //     _TexelSize: {
        //         value: new Vec2(1.0 / this.countX, 1.0 / this.countY)
        //     },
        //     _Stiffness: {
        //         value: params.PHYSICS.STIFFNESS
        //     },
        //     _Flip: {
        //         value: 0.0
        //     },
        //     _RestLength: this.restlengthCapture.uniform,
        //     _Clamp: {
        //         value: params.PHYSICS.CLAMP
        //     },
        //     _Size: {
        //         value: params.CLOTH.SIZE
        //       },

        // }

        // const constrainVerticalSecondPassU = {
        //     _TexelSize: {
        //         value: new Vec2(1.0 / this.countX, 1.0 / this.countY)
        //     },
        //     _Stiffness: {
        //         value: params.PHYSICS.STIFFNESS
        //     },
        //     _Flip: {
        //         value: 1.0
        //     },
        //     _RestLength: this.restlengthCapture.uniform,
        //     _Clamp: {
        //         value: params.PHYSICS.CLAMP
        //     },
        //     _Size: {
        //         value: params.CLOTH.SIZE
        //       },

        // }

        // const constrainBLTRfirstPasssU = {
        //     _TexelSize: {
        //         value: new Vec2(1.0 / this.countX, 1.0 / this.countY)
        //     },
        //     _Stiffness: {
        //         value: params.PHYSICS.STIFFNESS
        //     },
        //     _Flip: {
        //         value: 0.0
        //     },
        //     _RestLength: this.restlengthDiagonalCapture.uniform,
        //     _Clamp: {
        //         value: params.PHYSICS.CLAMP
        //     },
        //     _Size: {
        //         value: params.CLOTH.SIZE
        //       },

        // }

        // const constrainBLTRsecondPasssU = {
        //     _TexelSize: {
        //         value: new Vec2(1.0 / this.countX, 1.0 / this.countY)
        //     },
        //     _Stiffness: {
        //         value: params.PHYSICS.STIFFNESS
        //     },
        //     _Flip: {
        //         value: 1.0
        //     },
        //     _RestLength: this.restlengthDiagonalCapture.uniform,
        //     _Clamp: {
        //         value: params.PHYSICS.CLAMP
        //     },
        //     _Size: {
        //         value: params.CLOTH.SIZE
        //       },
        // }

        // const constrainBRTLfirstPasssU = {
        //     _TexelSize: {
        //         value: new Vec2(1.0 / this.countX, 1.0 / this.countY)
        //     },
        //     _Stiffness: {
        //         value: params.PHYSICS.STIFFNESS
        //     },
        //     _Flip: {
        //         value: 0.0
        //     },
        //     _RestLength: this.restlengthDiagonalCapture.uniform,
        //     _Clamp: {
        //         value: params.PHYSICS.CLAMP
        //     },
        //     _Size: {
        //         value: params.CLOTH.SIZE
        //       },

        // }

        // const constrainBRTLsecondPasssU = {
        //     _TexelSize: {
        //         value: new Vec2(1.0 / this.countX, 1.0 / this.countY)
        //     },
        //     _Stiffness: {
        //         value: params.PHYSICS.STIFFNESS
        //     },
        //     _Flip: {
        //         value: 1.0
        //     },
        //     _RestLength: this.restlengthDiagonalCapture.uniform,
        //     _Clamp: {
        //         value: params.PHYSICS.CLAMP
        //     },
        //     _Size: {
        //         value: params.CLOTH.SIZE
        //       },

        // }

        const constrainHorizontalFirstPassU = this.createConstraintUniform({flip: 0.0, restlength: this.restlengthCapture.uniform}); 
        const constrainHorizontalSecondPassU = this.createConstraintUniform({flip: 1.0, restlength: this.restlengthCapture.uniform});
        
        const constrainVerticalFirstPassU = this.createConstraintUniform({flip: 0.0, restlength: this.restlengthCapture.uniform});
        const constrainVerticalSecondPassU = this.createConstraintUniform({flip: 1.0, restlength: this.restlengthCapture.uniform});

        const constrainBLTRfirstPasssU = this.createConstraintUniform({flip: 0.0, restlength: this.restlengthDiagonalCapture.uniform}); 
        const constrainBLTRsecondPasssU = this.createConstraintUniform({flip: 1.0, restlength: this.restlengthDiagonalCapture.uniform});
        
        const constrainBRTLfirstPasssU = this.createConstraintUniform({flip: 0.0, restlength: this.restlengthDiagonalCapture.uniform});
        const constrainBRTLsecondPasssU = this.createConstraintUniform({flip: 1.0, restlength: this.restlengthDiagonalCapture.uniform});

        for(let i = 0; i < params.PHYSICS.STEPS; i++) {

                            // //HORIZONTAL CONSTRAINTS
            this.positionSim.addPass({
                fragment: constrainHorizontalKernel,
                uniforms: constrainHorizontalFirstPassU
            });
    
            this.positionSim.addPass({
                fragment: constrainHorizontalKernel,
                uniforms: constrainHorizontalSecondPassU
            });

            //VERTICAL CONSTRAINTS
            this.positionSim.addPass({
                fragment: constrainVerticalKernel,
                uniforms: constrainVerticalFirstPassU
            });
    
            this.positionSim.addPass({
                fragment: constrainVerticalKernel,
                uniforms: constrainVerticalSecondPassU
            });

            //DIAGONAL CONSTRAINTS
            this.positionSim.addPass({
                fragment: constrainBLTRKernel,
                uniforms: constrainBLTRfirstPasssU
            });

            this.positionSim.addPass({
                fragment: constrainBRTLKernel,
                uniforms: constrainBRTLfirstPasssU
            });

            this.positionSim.addPass({
                fragment: constrainBLTRKernel,
                uniforms: constrainBLTRsecondPasssU
            });

            this.positionSim.addPass({
                fragment: constrainBRTLKernel,
                uniforms: constrainBRTLsecondPasssU
            });

            }

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
            height: size,
            flipY: false
        })

    }

    createConstraintUniform({
        flip,
        restlength
    }) {
       

    const uniform = {
       
        _TexelSize: {
            value: new Vec2(1.0 / this.countX, 1.0 / this.countY)
        },
        _Stiffness: {
            value: params.PHYSICS.STIFFNESS
        },
        _Flip: {
            value: flip
        },
        _RestLength: restlength,
        _Clamp: {
            value: params.PHYSICS.CLAMP
        },
        _Size: {
            value: params.CLOTH.SIZE
          },

    }

       return uniform 
    }

    prewarm() {

        this.cornerUpdated = false;
        this.restlengthCapture.render();
        this.restlengthDiagonalCapture.render();

    }

    update(t, {
        isInteracting,
        inputWorldPos
    }) {

        this.currentPosCapture.render();   

        if(isInteracting) {
            if(this.cornerUpdated === false) {
                const corner = (Math.floor(Math.random() * 4) + 1);
                this.positionSim.passes[0].program.uniforms._Corner.value = corner;
                this.cornerUpdated = true;
            }
        } else {
            this.cornerUpdated = false;
        }

        this.positionSim.passes[0].program.uniforms._Time.value = t;
        this.positionSim.passes[0].program.uniforms._IsInteracting.value = isInteracting;
        this.positionSim.passes[0].program.uniforms._InputWorldPos.value.copy(inputWorldPos);
        this.positionSim.render();
        this.normalSim.render();
        this.prevPositionCapture.render();
        
    }

    get Positions() {
        return this.positionSim.fbo.read.texture
    }

    get Normals() {
        return this.normalSim.fbo.read.texture
    }

    get RestLengthsOrtho() {
        return this.restlengthCapture.fbo.read.texture
    }

    get RestLengthsDiagonal() {
        return this.restlengthDiagonalCapture.fbo.read.texture
    }

}