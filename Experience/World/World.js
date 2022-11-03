import * as THREE from "three";
import Experience from "../Experience";

import Environment from "./Environment";
import Island from "./Island";

export default class World {
    constructor() {
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.camera = this.experience.camera;
        this.resources = this.experience.resources;

        this.resources. on("ready", () => {
          console.log("Island loaded");
          this.environment = new Environment();
          this.island = new Island();
        })
    }

    resize() {
    }

    update() {
      if(this.island) {
        this.island.update();
      }
    }
}
