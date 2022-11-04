import * as THREE from "three";
import Experience from "../Experience";
import GSAP from "gsap";

export default class Controls {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;

        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.camera = this.experience.camera;

        this.progress = 0

        this.lerp = {
          current: 0,
          target: 0,
          ease: 0.1,
        };

        this.position = new THREE.Vector3(0,0,0);
        // To have the next point of the line
        this.lookAtPosition = new THREE.Vector3(0,0,0);

        // Buidling a vector to rotate the camera to the center
        // It is builde from the position vector and the lookAtPosition vector (which is the next point)
        this.directionalVector = new THREE.Vector3(0,0,0);

        // The staticvector will give the direction of the camera to look at the center and not outside
        this.staticVector = new THREE.Vector3(0,1,0);

        // The  crossvector is the result betweeen directional and static vectors
        this.crossVector = new THREE.Vector3(0,0,0);

        this.setPath();
        this.onWheel();
    }

    setPath() {
      //Create a closed wavey loop
      this.curve = new THREE.CatmullRomCurve3( [
        new THREE.Vector3( -5, 0, 0 ),
        new THREE.Vector3( 0, 0, -5 ),
        new THREE.Vector3( 5, 0, 0 ),
        new THREE.Vector3( 0, 0, 5 )
      ], true );

      const points = this.curve.getPoints( 50 );
      const geometry = new THREE.BufferGeometry().setFromPoints( points );

      const material = new THREE.LineBasicMaterial( { color: 0xff0000 } );

      // Create the final object to add to the scene
      const curveObject = new THREE.Line( geometry, material );

      this.scene.add(curveObject);
    }

    onWheel() {
      window.addEventListener("wheel", (e) => {
        if(e.deltaY > 0) {
          this.lerp.target += 0.01;
          // Use when we move automatically to keep the same direction
          this.back = false;
        } else {
          this.lerp.target -= 0.01;
          this.back = true;
        }
      })
    }

    resize() {
    }

    update() {
      this.lerp.current = GSAP.utils.interpolate(
        this.lerp.current,
        this.lerp.target,
        this.lerp.ease
        );

      this.lerp.target = GSAP.utils.clamp(0, 1, this.lerp.target);
      this.lerp.current = GSAP.utils.clamp(0, 1, this.lerp.current);
      // Method to follow the path center to the center point
      // copy the postion in the interpolate point
      this.curve.getPointAt(this.lerp.current %1, this.position);
      // put the camera on this position
      this.camera.orthographicCamera.position.copy(this.position);

      // Substracts the vectors
      this.directionalVector.subVectors(
        this.curve.getPointAt((this.lerp.current %1) + 0.000001),
        this.position
      );
      // Normalize the vector
      this.directionalVector.normalize();

      // buidl the cross vector
      this.crossVector.crossVectors(
        this.directionalVector,
        this.staticVector
      );

      // Multiply scalar vector
      this.crossVector.multiplyScalar(10000);

      // them move and orientate the camera
      this.camera.orthographicCamera.lookAt(0,0,0);

      // Method to follow a path smoothly
      // // to move automatically
      // if (this.back) {
      //   this.lerp.target += 0.001;
      // } else {
      //   this.lerp.target -= 0.001;
      // }

      // this.lerp.target = GSAP.utils.clamp(0, 1, this.lerp.target);
      // this.lerp.current = GSAP.utils.clamp(0, 1, this.lerp.current);

      // this.curve.getPointAt(this.lerp.current % 1, this.position);

      // this.curve.getPointAt(this.lerp.current + 0.00001 % 1, this.lookAtPosition);

      // this.camera.orthographicCamera.position.copy(this.position);

      // // To make the camera follow the curve with the angle
      // // If we desactivate it the camera follow the curve without rotate
      // this.camera.orthographicCamera.lookAt(this.lookAtPosition);
    }
}
