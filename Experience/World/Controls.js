import * as THREE from "three";
import Experience from "../Experience";
import GSAP from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";

export default class Controls {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;

        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.camera = this.experience.camera;
        this.island = this.experience.world.island.actualIsland;
        this.sizes = this.experience.sizes;
        GSAP.registerPlugin(ScrollTrigger);

        this.setPath();

    }

    setPath(){
      this.timeline = new GSAP.timeline();
      // to move the item with a time
      // this.timeline.to(this.island.position, {
      //   x: 5,
      //   duration: 20,
      // })

      // Top top, first one for the marker and second one the page
      this.timeline.to(this.island.position, {
        x: () => { return this.sizes.width * 0.0017 },
        scrollTrigger: {
          trigger: ".first-move",
          markers: true,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          invalidateOnRefresh: true
        }
      })
    }

    resize() {
    }

    update() {
    }
}
