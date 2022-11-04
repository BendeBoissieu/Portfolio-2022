import * as THREE from "three";
import Experience from "../Experience";
import GSAP from "gsap";

export default class Island {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;

        this.resources = this.experience.resources;
        this.island = this.resources.items.island;

        this.actualIsland = this.island.scene;

        // use for parallax effect
        this.lerp = {
          current: 0,
          target: 0,
          ease: 0.1,
        };

        this.setModel();

        this.onMouseMove();
    }

    setModel() {
      this.actualIsland.children.forEach(child => {
        if (child instanceof THREE.Group) {
          child.children.forEach(groupChild => {
            groupChild.castShadow = true;
            groupChild.receiveShadow = true;
          });
        }
        child.children.forEach(groupChild => {
          groupChild.castShadow = true;
          groupChild.receiveShadow = true;
          groupChild.children.forEach(groupChild => {
            groupChild.castShadow = true;
            groupChild.receiveShadow = true;
          });
        });
        child.castShadow = true;
        child.receiveShadow = true;
      });
      this.scene.add(this.actualIsland);
      this.actualIsland.scale.set(0.4,0.4,0.4);
    }

    onMouseMove() {
      window.addEventListener("mousemove", (e) => {
        // to have the right and left position between -1 and 1
        this.rotation = (((e.clientX - window.innerWidth) / 2) * 2)/window.innerWidth;
        this.lerp.target = this.rotation;
      });
    }

    resize() {
    }

    update() {
      // use for parallax effect
      this.lerp.current = GSAP.utils.interpolate(
        this.lerp.current,
        this.lerp.target,
        this.lerp.ease
        );

      this.actualIsland.rotation.y = this.lerp.current * 0.2;
    }
}
