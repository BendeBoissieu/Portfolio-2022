import * as THREE from "three";
import Experience from "../Experience";
import GSAP from "gsap";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

export default class Island {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.time = this.experience.time;

        this.resources = this.experience.resources;
        this.island = this.resources.items.island;

        this.actualIsland = this.island.scene;
        this.link = this.experience.link;

        // use for parallax effect
        this.lerp = {
          current: 0,
          target: 0,
          ease: 0.1,
        };

        this.setModel();
        this.setAnimation();
        this.onMouseMove();
        this.onDeviceOrientation();
    }

    setAnimation() {
      this.mixer = new THREE.AnimationMixer(this.actualIsland);
      this.island.animations.forEach(animation => {
        this.swim = this.mixer.clipAction(animation);
        this.swim.play();
      });
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
            groupChild.children.forEach(groupChild => {
              groupChild.castShadow = true;
              groupChild.receiveShadow = true;
              groupChild.children.forEach(groupChild => {
                groupChild.castShadow = true;
                groupChild.receiveShadow = true;
              });
            });
          });
        });
        if (child.name === "Screen_billboard") {
          child.material = new THREE.MeshStandardMaterial({
              map: this.resources.items.cardboardScreen,
              side: THREE.FrontSide,
              specular: 0xffffff,
              emissiveMap: this.resources.items.cardboardScreen,
              emissiveIntensity: 0.2,
              emissive: 0x9b9fa2,
              metalness: 0.6,
              roughness: 0
          });
        }
        if(child.name === "Macbook"){
          child.children.forEach(child => {
            if(child.name === "Screen"){
              child.material = new THREE.MeshStandardMaterial({
                map: this.resources.items.Camaloon,
                roughness: 0,
                side: THREE.FrontSide,
                emissiveMap: this.resources.items.Camaloon,
                emissiveIntensity: 0.2,
                emissive: 0x9b9fa2,
                metalness: 0.8,
              });
            }
          });
        }
        child.castShadow = true;
        child.receiveShadow = true;
      });
      this.scene.add(this.actualIsland);
      this.actualIsland.scale.set(0.7,0.7,0.7);
    }

    onMouseMove() {
      window.addEventListener("mousemove", (e) => {
        // to have the right and left position between -1 and 1
        this.rotation = (((e.clientX - window.innerWidth) / 2) * 2)/window.innerWidth;
        this.lerp.target = this.rotation;
      });
    }

    onDeviceOrientation() {
      window.addEventListener("deviceorientation", (e) => {
        this.rotation = e.gamma * 0.08;
        this.lerp.target = this.rotation;
      });
    }

    resize() {
    }

    update() {
      // update animation
      this.mixer.update(this.time.delta * 0.0009);
      // use for parallax effect
      this.lerp.current = GSAP.utils.interpolate(
        this.lerp.current,
        this.lerp.target,
        this.lerp.ease
        );

      if (this.actualIsland.scale.x < 10 ) {
        this.actualIsland.rotation.y = this.lerp.current * 0.2;
      } else {
        this.actualIsland.rotation.y = this.lerp.current * 0.02;
      }

    }

    changeScreen(link) {
      Object.keys(this.resources.items).forEach(item => {
        if (link == item) {
          this.screenItem = this.resources.items[item]
        }
      })

      this.actualIsland.children.forEach(child => {
        if(child.name === "Macbook"){
          console.log(this.link);
          child.children.forEach(child => {
            if(child.name === "Screen"){
              child.material = new THREE.MeshStandardMaterial({
                map: this.screenItem,
                roughness: 0.2,
                side: THREE.FrontSide,
                emissiveMap: this.screenItem,
                emissiveIntensity: 0.2,
                emissive: 0x9b9fa2,
                metalness: 0.8
              });
              child.castShadow = true;
            }
          });
        }
      });
    }
}
