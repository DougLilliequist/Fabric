import {
    Renderer
} from "../../vendor/ogl/src/core/Renderer.js";
import {
    Transform
} from "../../vendor/ogl/src/core/Transform.js";
import {
    Camera
} from "../../vendor/ogl/src/core/Camera.js";
import {
    Orbit
} from "../../vendor/ogl/src/extras/Orbit.js";
import {
    Raycast
} from '../../vendor/ogl/src/extras/Raycast';
import { Vec2 } from "../../vendor/ogl/src/math/Vec2.js";

import {DisplayQuad} from './debug/DisplayQuad.js';

import {
    Verlet
} from "./VerletGPU/index.js";
import { Vec3 } from "../../vendor/ogl/src/math/Vec3.js";

export default class World3d {
    constructor() {
        this.init();
        this.initEvents();
        this.start();
    }

    init() {
        this.renderer = new Renderer({
            width: window.innerWidth,
            height: window.innerHeight,
            antialias: true
        });
        this.gl = this.renderer.gl;

        // this.gl.clearColor(0.9, 0.9, 0.9, 1);
        // this.gl.clearColor(0.0, 0.5, 0.98, 1); //ghibli blue
        this.gl.clearColor(0.0, 0.0, 0.0, 1);
        this.gl.canvas.style.top = "0";
        this.gl.canvas.style.left = "0";
        this.gl.canvas.style.zIndex = "0";
        this.gl.canvas.style.position = "absolute";
        this.gl.canvas.style.width = "100vw";
        this.gl.canvas.style.height = "100vh";

        document.body.appendChild(this.gl.canvas);

        this.camera = new Camera(this.gl, {
            aspect: window.innerWidth / window.innerHeight
        });
        this.camera.position.x = 0.0;
        this.camera.position.y = 0.0;
        this.camera.position.z = 15.0;
        // this.camera.lookAt([0.0, 0.0, 0.0]);

        this.orbitCamera = new Orbit(this.camera, {
            element: this.gl.canvas
        });

        this.scene = new Transform();

        this.initMesh();
        this.initDebug();
    }

    initEvents() {

        this.inputPos = new Vec3(0.0, 0.0, 0.5);
        this.projectedInputPos = new Vec3(0.0, 0.0, 0.5);
        this.worldInputPos = new Vec3(0.0,0.0,0.5);
        this.raycast = new Raycast(this.gl);
        this.isInteracting = false;

        window.addEventListener("resize", this.onResize.bind(this));
        window.addEventListener('mousedown', this.onMouseDown);
        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('mouseup', this.onMouseUp);
    }

    onMouseDown = e => {

        this.isInteracting = true;
        this.inputPos.x = (e.clientX / window.innerWidth) * 2.0 - 1.0;
        this.inputPos.y = (1.0 - e.clientY / window.innerHeight) * 2.0 - 1.0;

    }

    onMouseMove = e => {

        if(this.isInteracting === false) return;

        this.inputPos.x = (e.clientX / window.innerWidth) * 2.0 - 1.0;
        this.inputPos.y = (1.0 - e.clientY / window.innerHeight) * 2.0 - 1.0;        

    }

    onMouseUp = () => {

        this.isInteracting = false;

    }

    initMesh() {
        this.verlet = new Verlet(this.gl);
        this.verlet.setParent(this.scene);
    }

    initDebug() {
        
        this.positionQuad = new DisplayQuad(this.gl, {
            aspect: this.renderer.width/this.renderer.height,
            scale: 0.5,
            position: new Vec2(-0.87,0.74)
        });

        // this.positionQuad.setParent(this.scene);

        this.prevPositionQuad = new DisplayQuad(this.gl, {
            aspect: this.renderer.width/this.renderer.height,
            scale: 0.5,
            position: new Vec2(-0.87,0.23)
        })

        // this.prevPositionQuad.setParent(this.scene);

        
        this.restlengthQuad = new DisplayQuad(this.gl, {
            aspect: this.renderer.width/this.renderer.height,
            scale: 0.5,
            position: new Vec2(-0.87, -0.28)
        })

        // this.restlengthQuad.setParent(this.scene);

    }

    start() {
        this.time = Date.now();
        this.prevTime = this.time;

        // this.positionQuad.Texture = this.verlet.simulator.positionSim.uniform.value;
        // this.prevPositionQuad.Texture = this.verlet.simulator.normalSim.uniform.value;
        // this.restlengthQuad.Texture = this.verlet.simulator.restlengthCapture.fbo.read.texture;


        this.update();
    }

    render({
        scene,
        camera = null,
        clear = true
    }) {
        this.renderer.render({
            scene,
            camera,
            clear
        });
    }

    calcScreenToWorldPos() {

        
        this.camera.unproject(this.projectedInputPos.copy(this.inputPos));
        this.projectedInputPos.sub(this.camera.position).normalize();
        
        const dist = -this.camera.position.z / this.projectedInputPos.z;

        this.worldInputPos.copy(this.camera.position).add(this.projectedInputPos.multiply(dist));
        this.worldInputPos.z = -this.inputPos.y * 10.0;

    }

    update() {
        window.requestAnimationFrame(() => this.update());

        this.time = Date.now();
        let tmpTime = this.time;
        this.deltaTime = (this.time - this.prevTime) / 1000.0;
        this.prevTime = tmpTime;

        this.camera.updateMatrixWorld();
        //  this.orbitCamera.update();

        this.raycast.castMouse(this.camera, this.inputPos);
        // this.verlet.isHit = false;
        // this.raycast.intersectBounds([this.verlet]);

        // this.positionQuad.Texture = this.verlet.Positions;
        this.calcScreenToWorldPos();

        // this.positionQuad.Texture = this.verlet.simulator.positionSim.uniform.value;
        // this.prevPositionQuad.Texture = this.verlet.simulator.normalSim.uniform.value;
        this.restlengthQuad.Texture = this.verlet.shadowPass.target.texture;

        this.verlet.update({
            t: this.deltaTime,
            isInteracting: this.isInteracting,
            inputWorldPos: this.worldInputPos,
            scene: this.scene
        });

        this.render({
            scene: this.scene,
            camera: this.camera,
            clear: true
        });

        this.verlet.FlipFace();

        this.render({
            scene: this.scene,
            camera: this.camera,
            clear: false
        });

        this.verlet.FlipFace();
    }

    onResize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.perspective({
            aspect: this.gl.canvas.width / this.gl.canvas.height
        });
    }
}