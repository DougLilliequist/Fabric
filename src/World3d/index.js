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
        this.initInputParams();
    }

    init() {
        this.renderer = new Renderer({
            width: window.innerWidth,
            height: window.innerHeight,
            antialias: true
        });
        this.gl = this.renderer.gl;

        this.gl.clearColor(0.8, 0.8, 0.83, 1);
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
        this.camera.position.z = 7.0;

        this.orbitCamera = new Orbit(this.camera, {
            element: this.gl.canvas
        });

        this.scene = new Transform();

        this.initMesh();
        this.initDebug();
    }

    initInputParams() {

        this.inputPos = new Vec3(0.0, 0.0, 0.5);
        this.projectedInputPos = new Vec3(0.0, 0.0, 0.5);
        this.worldInputPos = new Vec3(0.0,0.0,0.5);
        this.raycast = new Raycast(this.gl);
        this.isInteracting = false;

    }

    onMouseDown(e) {

        this.isInteracting = true;
        this.inputPos.x = (e.clientX / window.innerWidth) * 2.0 - 1.0;
        this.inputPos.y = (1.0 - e.clientY / window.innerHeight) * 2.0 - 1.0;

    }

    onMouseMove(e) {

        if(this.isInteracting === false) return;

        this.inputPos.x = (e.clientX / window.innerWidth) * 2.0 - 1.0;
        this.inputPos.y = (1.0 - e.clientY / window.innerHeight) * 2.0 - 1.0;        

    }

    onMouseUp(e) {

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

        this.prevPositionQuad = new DisplayQuad(this.gl, {
            aspect: this.renderer.width/this.renderer.height,
            scale: 0.5,
            position: new Vec2(-0.87,0.23)
        })
        
        this.restlengthQuad = new DisplayQuad(this.gl, {
            aspect: this.renderer.width/this.renderer.height,
            scale: 0.5,
            position: new Vec2(-0.87, -0.28)
        })

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
        // this.worldInputPos.z = -this.inputPos.y * 1.0;
        this.worldInputPos.z = -this.inputPos.y * 5.0;

    }

    update(dt) {

        this.camera.updateMatrixWorld();
        //  this.orbitCamera.update();

        this.calcScreenToWorldPos();

        this.verlet.update({
            t: dt,
            isInteracting: this.isInteracting,
            inputWorldPos: this.worldInputPos,
            scene: this.scene
        });

        this.render({
            scene: this.scene,
            camera: this.camera,
            clear: true
        });

    }

    onResize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.perspective({
            aspect: this.gl.canvas.width / this.gl.canvas.height
        });
    }
}