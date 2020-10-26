import { Program } from "../../../../vendor/ogl/src/core/Program";
import { Vec2 } from "../../../../vendor/ogl/src/math/Vec2";
import { Texture } from "../../../../vendor/ogl/src/core/Texture";
const { GPGPU } = require("../../../../vendor/ogl/src/extras/GPGPU");

const prevPosKernel = require('./kernels/prevPos.frag');
const currentPosKernel = require('./kernels/currentPos.frag');
const positionKernel = require('./kernels/position.frag');
const normalKernel = require('./kernels/calcNormal.frag');

const restlengthKernel = require('./kernels/restLength.frag');
const constraintKernel = require('./kernels/constrain.frag');
const constrainHorizontalKernel = require('./kernels/constrainHorizontal.frag');
const constrainVerticalKernel = require('./kernels/constrainVertical.frag');

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

    // initVelocity() {

    //     const velocityData = new Float32Array(this.countX * this.countY * 4);
    //     // for(let i = 0; i < velocityData.length;i++) {
    //     //     velocityData[i] = (Math.random() * 2.0 - 1.0) * 0.0001;
    //     // }
    //     this.velocitySim = new GPGPU(this.gl, {
    //         data: velocityData
    //     });

    // }

    initSimulators() {

        this.positionData = new Float32Array(this.countX*this.countY*4);
        let positionDataIterator = 0;
        let origDataIterator = 0;
        
        for(let y = 0; y < this.countY; y++) {
            
            for(let x = 0; x < this.countX; x++) {

                this.positionData[positionDataIterator++] = this.data[origDataIterator++];
                this.positionData[positionDataIterator++] = this.data[origDataIterator++];
                this.positionData[positionDataIterator++] = this.data[origDataIterator++];
               
                let isTopLeft = y === 0 && x === 0;
                let isTopRight = y === 0 && x >= this.countX - 1;
               
                this.positionData[positionDataIterator++] = (isTopLeft || isTopRight) ? 0.0 : 1.0;
                // this.positionData[positionDataIterator++] = 1.0;

            }

        }

        this.currentPosCapture = new GPGPU(this.gl, {
            data: this.positionData,
            type: this.gl.FLOAT
        });

        // const prevPositionData = new Float32Array(this.countX*this.countY*4);
        const prevPositionData = this.positionData.slice();
        let prevPosIterator = 0;
        origDataIterator = 0;
        // for(let y = 0; y < this.countY; y++) {
            
            for(let x = 0; x < this.countX*this.countY; x++) {

                
                let offsetx = Math.random() * 2.0 - 1.0;
                let offsety = Math.random() * 2.0 - 1.0;

                let offsetz = Math.random() * 2.0 - 1.0;

                prevPositionData[prevPosIterator++] += (offsetx*0.5);
                prevPositionData[prevPosIterator++] += (offsety*0.5);
                prevPositionData[prevPosIterator++] += (offsetz*0.5);
                prevPositionData[prevPosIterator++] += 0.0;

            // }

        }

        this.prevPositionCapture = new GPGPU(this.gl, {
            data: prevPositionData,
            type: this.gl.FLOAT
        });

        this.positionSim = new GPGPU(this.gl, {
            data: this.positionData,
            type: this.gl.FLOAT
        });

        const normalData = new Float32Array(this.countX*this.countY*4.0);
        let normalIterator = 0;
        
        for(let i = 0; i < this.countX*this.countY; i++) {

            normalData[normalIterator++] = 0.0;
            normalData[normalIterator++] = 0.0;
            normalData[normalIterator++] = 1.0;
            normalData[normalIterator++] = 1.0;

        }

        this.normalSim = new GPGPU(this.gl, {
            data: normalData,
            type: this.gl.FLOAT
        });

        this.restlengthCapture = new GPGPU(this.gl, {
            data: new Float32Array(this.countX*this.countY*4), //temporary for now,
            type: this.gl.FLOAT
        });
        
        this.constraintSim = new GPGPU(this.gl, {
            data: this.positionData,
            type: this.gl.FLOAT
        });
       
        //init constraint simulation here

        //maybe have a final position pass here?


    }

    initPrograms() {

        const restlengthCaptureU = {
            _InitPos: this.positionSim.uniform
        }

        this.restlengthCapture.addPass({
            fragment: restlengthKernel,
            uniforms: restlengthCaptureU
        });

        const positionSimU = {
            _PrevPos: this.prevPositionCapture.uniform,
            _CurrentPos: this.currentPosCapture.uniform
        }

        this.positionSim.addPass({
            fragment: positionKernel,
            uniforms: positionSimU
        });

        const normalSimU = {
            _Position: this.positionSim.uniform
        }

        this.normalSim.addPass({
            fragment: normalKernel,
            uniforms: normalSimU
        });

        // const constraintU = {
        //     _TexelSize: {
        //         value: new Vec2(1.0 / this.countX, 1.0 / this.countY)
        //     },
        //     _RestLength: this.restlengthCapture.uniform,
        // }

        // for(let i = 0; i < 8; i++) {
        //     this.positionSim.addPass({
        //         fragment: constraintKernel,
        //         uniforms: constraintU
        //    });
        // }

        const prevPosCaptureSimU = {
            _Positions: this.currentPosCapture.uniform
        }

        this.prevPositionCapture.addPass({
            fragment: prevPosKernel,
            uniforms: prevPosCaptureSimU
        });

        const currentPosCaptureSimU = {
            _Positions: this.positionSim.uniform
        }

        this.currentPosCapture.addPass({
            fragment: currentPosKernel,
            uniforms: currentPosCaptureSimU
        });

        const constrainHorizontalFirstPassU = {
            _TexelSize: {
                value: new Vec2(1.0 / this.countX, 1.0 / this.countY)
            },
            _Flip: {
                value: 0.0
            },
             _RestLength: this.restlengthCapture.uniform,
            //  _Position: this.positionSim.uniform
        }

        
        const constrainHorizontalSecondPassU = {
            _TexelSize: {
                value: new Vec2(1.0 / this.countX, 1.0 / this.countY)
            },
            _Flip: {
                value: 1.0
            },
            _RestLength: this.restlengthCapture.uniform,
            // _Position: this.positionSim.uniform

        }

        
        const constrainVerticalFirstPassU = {
            _TexelSize: {
                value: new Vec2(1.0 / this.countX, 1.0 / this.countY)
            },
            _Flip: {
                value: 0.0
            },
            _RestLength: this.restlengthCapture.uniform,
            // _Position: this.positionSim.uniform

        }

        const constrainVerticalSecondPassU = {
            _TexelSize: {
                value: new Vec2(1.0 / this.countX, 1.0 / this.countY)
            },
            _Flip: {
                value: 1.0
            },
            _RestLength: this.restlengthCapture.uniform,
            // _Position: this.positionSim.uniform

        }

        for(let i = 0; i < 1; i++) {


            this.positionSim.addPass({
                fragment: constrainHorizontalKernel,
                uniforms: constrainHorizontalFirstPassU
            });
    
            this.positionSim.addPass({
                fragment: constrainHorizontalKernel,
                uniforms: constrainHorizontalSecondPassU
            });
    
            this.positionSim.addPass({
                fragment: constrainVerticalKernel,
                uniforms: constrainVerticalFirstPassU
            });
    
            this.positionSim.addPass({
                fragment: constrainVerticalKernel,
                uniforms: constrainVerticalSecondPassU
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

    prewarm() {

        this.restlengthCapture.render();
    }

    update() {
       
        this.currentPosCapture.render();       
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

}