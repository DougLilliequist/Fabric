import World3d from "./World3d";
import { gsap } from "gsap";

export class App {
  constructor() {
    new World3d();
    this.initDomReferences();
    this.init();
    this.initEvents();
  }

  initDomReferences() {
    this.eventDetails = document.querySelector(".event-details");
    this.eventDetailsContent = document.querySelectorAll(".event-detail");
  }

  init() {
    this.time = 0;
    this.holdThreshold = 0.1;
    this.isInteracting = false;
    this.animDuration = 0.2;
    this.eventDetails.classList.add("hidden");
  }

  initEvents() {
    window.addEventListener("touchstart", this.onTouchStart);
    window.addEventListener("touchend", this.onTouchEnd);
    window.addEventListener("touchcancel", this.onTouchEnd);
  }

  onTouchStart = event => {
    this.isInteracting = true;
    this.revealContent();
  };

  onTouchEnd = event => {
    this.isInteracting = false;
    this.hideContent();
  };

  revealContent() {
    gsap.fromTo(
      this.eventDetails,
      {
        opacity: 0
      },
      {
        opacity: 1,
        duration: this.animDuration,
        onStart: () => {
          this.eventDetails.classList.remove("hidden");
        }
      }
    );

    gsap.fromTo(
      this.eventDetailsContent,
      {
        opacity: 0
      },

      {
        duration: 0.5,
        opacity: 1,
        stagger: 0.2
      }
    );
  }

  hideContent() {
    gsap.fromTo(
      this.eventDetails,
      {
        opacity: 1
      },
      {
        opacity: 0,
        duration: this.animDuration,
        onComplete: () => {
          this.eventDetails.classList.add("hidden");
        }
      }
    );
  }
}

window.onload = () => new App();
