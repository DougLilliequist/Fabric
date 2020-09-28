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
    Verlet
} from "./Verlet/index.js";

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

        this.gl.clearColor(0.9, 0.9, 0.9, 1);
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
    }

    initEvents() {
        window.addEventListener("resize", this.onResize.bind(this));
    }

    initMesh() {
        this.verlet = new Verlet(this.gl);
        this.verlet.setParent(this.scene);
    }

    start() {
        this.time = Date.now();
        this.prevTime = this.time;
        this.update();
    }

    render({
        scene,
        camera = null,
        clear
    }) {
        this.renderer.render({
            scene,
            camera
        });
    }

    update() {
        window.requestAnimationFrame(() => this.update());

        this.time = Date.now();
        let tmpTime = this.time;
        this.deltaTime = (this.time - this.prevTime) / 1000.0;
        this.prevTime = tmpTime;

        this.orbitCamera.update();
        this.verlet.update({
            t: this.deltaTime
        });
        this.render({
            scene: this.scene,
            camera: this.camera
        });
    }

    onResize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.perspective({
            aspect: this.gl.canvas.width / this.gl.canvas.height
        });
    }
}