import * as THREE from "three";
import Experience from "../Experience";
import Controls from "./Controls";

import Environment from "./Environment";
import { EventEmitter } from "events";
import Island from "./Island";
import Floor from "./Floor";

export default class World extends EventEmitter{
    constructor() {
        super();
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;

        this.canvas = this.experience.canvas;
        this.camera = this.experience.camera;
        this.resources = this.experience.resources;
        this.theme = this.experience.theme;
        this.screen = this.experience.screen;

        this.resources. on("ready", () => {
          this.environment = new Environment();
          this.island = new Island();
          this.floor = new Floor();
          this.controls = new Controls();
          this.emit("worldready");
        })
        this.theme.on("switch", (theme) => {
          this.switchTheme(theme);
        });
        this.screen.on("hoverLink", (link) => {
          this.changeScreen(link);
        })
    }

    switchTheme(theme) {
      if (this.environment) {
          this.environment.switchTheme(theme);
      }
    }

    changeScreen(link) {
      if (this.island) {
        this.island.changeScreen(link);
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
