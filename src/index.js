import World3d from './World3d'

export class App {
    constructor() {
        new World3d();
    }
}

window.onload = () => new App();