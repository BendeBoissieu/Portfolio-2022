import * as THREE from "three";
import Experience from "../Experience";

export default class Floor {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.setFloor();
    }

    setFloor() {
      console.log(this.actualFloor )
      this.geometry = new THREE.PlaneGeometry(100,100);
      this.material = new THREE.MeshStandardMaterial({
        color: "#ffffff",
        side: THREE.BackSide,
      })

      this.plane = new THREE.Mesh(this.geometry, this.material);
      this.scene.add(this.plane);

      this.plane.rotation.x = Math.PI / 2;
      this.plane.position.y = - 0.7;
      this.plane.receiveShadow = true;
    }

    resize() {
    }

    update() {
    }
}
