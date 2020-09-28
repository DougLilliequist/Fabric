import {
    GPGPU
} from '../../../../vendor/ogl/src/extras/GPGPU.js';

import {
    Texture
} from '../../../../vendor/ogl/src/core/Texture.js'

const velocityKernel = require('./kernels/velocity.frag');
const positionKernel = require('./kernels/position.frag')

export class Simulation {

    constructor(gl, {
        width = 2,
        height = 2
    }) {

        this.gl = gl;

        this.width = width;
        this.height = height;
        this.count = this.width * this.height;

        this.initVelocity();
        this.initPosition();
        this.prevWarm();

    }

    initVelocity() {

        // this.initPositionData = new Float32Array(this.count * 4.0);

        // let initPositionIterator = 0;

        // for (let y = 0; y < this.count; y++) {

        //     this.initPositionData[initPositionIterator++] = (2.0 * Math.random() - 1.0) * 1.0;
        //     this.initPositionData[initPositionIterator++] = (2.0 * Math.random() - 1.0) * 1.0;
        //     this.initPositionData[initPositionIterator++] = (2.0 * Math.random() - 1.0) * 1.0;
        //     this.initPositionData[initPositionIterator++] = Math.random();

        // }

        const initVelocityData = new Float32Array(this.count * 4.0);

        // let initVelocityIterator = 0;

        // for (let y = 0; y < this.count; y++) {

        //     initVelocityData[initVelocityIterator++] = this.initPositionData[y * 4.0 + 0] * 0.05;
        //     initVelocityData[initVelocityIterator++] = this.initPositionData[y * 4.0 + 1] * 0.05;
        //     initVelocityData[initVelocityIterator++] = this.initPositionData[y * 4.0 + 2] * 0.05;
        //     initVelocityData[initVelocityIterator++] = 0.0;

        // }

        this.velocitySim = new GPGPU(this.gl, {
            data: initVelocityData
        });

        const uniforms = {

            _Position: null,

            _PrevPosition: {
                value: null
            },
            _TexelSize: {
                value: 1.0 / this.width
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

    initPosition() {

        this.initPositionData = new Float32Array(this.count * 4.0);

        let initPositionIterator = 0;

        for (let y = 0; y < this.count; y++) {

            this.initPositionData[initPositionIterator++] = (2.0 * Math.random() - 1.0) * 0.1;
            this.initPositionData[initPositionIterator++] = (2.0 * Math.random() - 1.0) * 0.1;
            this.initPositionData[initPositionIterator++] = (2.0 * Math.random() - 1.0) * 0.1;
            this.initPositionData[initPositionIterator++] = Math.random();

        }

        this.positionSim = new GPGPU(this.gl, {
            data: this.initPositionData
        });

        const uniforms = {
            _Velocity: null,
            _PrevPosition: {
                value: null
            },
            _TexelSize: {
                value: 1.0 / this.width
            }
        }

        this.positionSim.addPass({
            fragment: positionKernel,
            uniforms
        })

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

            prevPositionsData[prevPositionsIterator++] = this.initPositionData[posIterator++] * 0.99;
            prevPositionsData[prevPositionsIterator++] = this.initPositionData[posIterator++] * 0.99;
            prevPositionsData[prevPositionsIterator++] = this.initPositionData[posIterator++] * 0.99;
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

        const activePositionSimPass = this.positionSim.passes[0];
        activePositionSimPass.program.uniforms._Velocity = this.velocitySim.uniform;
        this.positionSim.render();
    }

    update({
        t
    }) {

        const activeVelocitySimPass = this.velocitySim.passes[0];
        activeVelocitySimPass.program.uniforms._Position = this.positionSim.uniform;
        activeVelocitySimPass.program.uniforms._PrevPosition.value = this.positionSim.fbo.write.texture;
        this.velocitySim.render();

        const activePositionSimPass = this.positionSim.passes[0];
        activePositionSimPass.program.uniforms._Velocity = this.velocitySim.uniform;
        this.positionSim.render();

    }

    get Position() {

        return this.positionSim.fbo.read.texture;

    }

    get Velocity() {
        return this.velocitySim.fbo.read.texture;
    }

}