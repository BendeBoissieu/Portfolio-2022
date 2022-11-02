import * as THREE from "three";
import Experience from "../Experience";

export default class Island {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;

        this.resources = this.experience.resources;
        this.island = this.resources.items.island;

        this.actualIsland = this.island.scene;

        this.setModel();
        // const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        // const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        // const cube = new THREE.Mesh( geometry, material );
        // this.scene.add( cube );

    }

    setModel() {
      this.scene.add(this.actualIsland);
      this.actualIsland.scale.set(0.4,0.4,0.4);
    }
    resize() {
    }

    update() {
    }
}
