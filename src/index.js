import World3d from './World3d'
import { Vec3 } from '../vendor/ogl/src/math/Vec3';


export class App {
    constructor() {
        new World3d();
        
        // this.initWorker();
        this.val = 0.0;
        // this.testWorker();

    }

    initWorker() {

        this.worker = new Worker('./workerTest.js');
        this.worker.onmessage = e => {
            console.log('worker got message');
            console.log(e);
        }

    }

    testWorker() {
        this.worker.postMessage([new Vec3(1.0, 1.0, 1.0)]);

    }
}

window.onload = () => new App();