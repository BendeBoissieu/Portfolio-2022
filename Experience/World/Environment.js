import * as THREE from "three";
import Experience from "../Experience";

export default class Environment {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;

        this.setSunLight();
    }
    setSunLight() {
      this.sunLight = new THREE.DirectionalLight("#ffffff", 2);
      this.sunLight.castShadow = true;
      this.sunLight.shadow.camera.far = 20;
      this.sunLight.shadow.mapSize.set(2048,2048);
      this.sunLight.shadow.normalBias = 0.05;
      this.sunLight.position.set(-5, 4.5, 5);
      this.scene.add(this.sunLight);

      // const helper = new THREE.CameraHelper(this.sunLight.shadow.camera);
      // this.scene.add(helper);

      this.ambientLight = new THREE.AmbientLight("#ffffff", 0.5);
      this.scene.add(this.ambientLight);
    }
}
