import * as THREE from "three";
import Experience from "../Experience";
import Controls from "./Controls";

import Environment from "./Environment";
import Island from "./Island";
import Floor from "./Floor";

export default class World {
    constructor() {
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;

        this.canvas = this.experience.canvas;
        this.camera = this.experience.camera;
        this.resources = this.experience.resources;
        this.theme = this.experience.theme;

        this.resources. on("ready", () => {
          console.log("Island loaded");
          this.environment = new Environment();
          this.island = new Island();
          this.controls = new Controls();
          this.floor = new Floor();
        })
        this.theme.on("switch", (theme) => {
          this.switchTheme(theme);
        });
    }

    switchTheme(theme) {
      if (this.environment) {
          this.environment.switchTheme(theme);
      }
    }

    resize() {
    }

    update() {
      if(this.island) {
        this.island.update();
      }
      if(this.controls) {
        this.controls.update();
      }
    }
}
