import {gsap} from 'gsap';

export default class CanvasCursor {

    constructor() {

        this.initCanvas();
        this.initCursorParams();

    }

    initCanvas() {

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.pixelRatio = window.devicePixelRatio;

        this.width = this.ctx.canvas.width = window.innerWidth * Math.min(2.0, this.pixelRatio);
        this.height = this.ctx.canvas.height = window.innerHeight* Math.min(2.0, this.pixelRatio);

        this.canvas.style.width = "100vw";
        this.canvas.style.height = "100vh";
        this.canvas.style.position = "absolute";
        this.canvas.style.top = "0";
        this.canvas.style.left = "0";
        this.canvas.style.zIndex = "1";

        document.body.appendChild(this.canvas);

    }

    initCursorParams() {

        this.position = {
            x: this.width * 0.5,
            y: this.height * 0.5
        }

        this.isInteracting = false;
        this.inputTimeout = 0;
        this.inputTimeoutCap = 0.5;
        this.isVisible = false;

        this.radius = 10 * this.pixelRatio;
        this.startAngle = 0;
        this.endAngle = Math.PI * 2;
        this.strokeAlpha = 0.0;
        this.strokeWidth = 1.0 * this.pixelRatio;

    }

    onMouseDown(e) {
        
        this.inputTimeout = 0;
        this.isInteracting = true;
        this.position.x = e.clientX * this.pixelRatio;
        this.position.y = e.clientY * this.pixelRatio;

    }

    onMouseMove(e) {

        this.inputTimeout = 0;
        this.position.x = e.clientX * this.pixelRatio;
        this.position.y = e.clientY * this.pixelRatio;

    }

    onMouseUp(e) {

        this.isInteracting = false;

    }

    animateCursor() {

        if(this.inputTimeout <= 0.0) {

            if(this.isVisible === false) {
                this.isVisible = true;
                gsap.to(this, {
                    strokeAlpha: 1.0,
                    duration: 0.35,
                });

            }

        } else {
            if(this.inputTimeout > this.inputTimeoutCap) {

                if(this.isVisible === true) {

                    this.isVisible = false;
                    gsap.to(this, {
                        strokeAlpha: 0.0,
                        duration: 0.35,
                    });
                }

            }
        }

    }


    draw() {
        
        this.ctx.clearRect(0,0,this.width, this.height);
        this.ctx.beginPath();
        this.ctx.strokeStyle = `rgba(${0.0},${0.0},${0.0}, ${this.strokeAlpha})`;
        this.ctx.arc(this.position.x, this.position.y, this.radius, this.startAngle, this.endAngle, false);
        this.ctx.lineWidth = this.strokeWidth;
        this.ctx.stroke();
        this.ctx.closePath();

    }

    update(dt) {
        
        this.animateCursor();
        this.draw();

        if(this.isInteracting) return;
        this.inputTimeout += dt;

    }

    onResize() {

        this.width = this.ctx.canvas.width = window.innerWidth * this.pixelRatio;
        this.height = this.ctx.canvas.height = window.innerHeight * this.pixelRatio;

    }

}