import World3d from './World3d'

export class App {
    constructor() {
       this.World3d = new World3d();
       this.initEvents();
       this.start();
    }

    initEvents() {

        this.time = Date.now();
        this.prevTime = this.time;
        this.deltaTime = 0;
        this.ctaHidden = false;

        window.addEventListener("resize", this.onResize.bind(this));
        window.addEventListener('mousedown', this.onMouseDown);
        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('mouseup', this.onMouseUp);

    }

    start() {
    
        this.update();

    }

    onMouseDown = e => {

        this.World3d.onMouseDown(e);
        this.hideCTA();


    }

    onMouseMove = e => {

        this.World3d.onMouseMove(e);

    }

    onMouseUp = e => {

        this.World3d.onMouseUp(e);

    }

    onResize = () => {
        this.World3d.onResize();
    }

    hideCTA() {

        if(this.ctaHidden === false) {
            this.ctaHidden = true;
            document.body.querySelector('.cta-message').classList.add('hidden');
        }

    }

    update = () => {
    
        window.requestAnimationFrame(() => this.update());

        this.time = Date.now();
        let tmpTime = this.time;
        this.deltaTime = (this.time - this.prevTime) / 1000.0;
        this.prevTime = tmpTime;

        this.World3d.update(this.deltaTime);

    }
    
}

window.onload = () => new App();