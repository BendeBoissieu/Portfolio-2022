import * as THREE from "three";
import { EventEmitter } from "events";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"

import Experience from "../Experience";

export default class Resources extends EventEmitter {
  constructor(assets) {
    super();
    this.experience = new Experience();
    this.renderer = this.experience.renderer;

    this.assets = assets;

    this.items = {};
    this.queue = this.assets.length;
    this.loaded = 0;

    this.setLoaders();
    this.startLoadings();
  }

  setLoaders() {
    this.loaders = {}
    this.loaders.gltfloader = new GLTFLoader();
    this.loaders.dracoloader = new DRACOLoader();
    this.loaders.dracoloader.setDecoderPath("/draco");
    this.loaders.gltfloader.setDRACOLoader(this.loaders.dracoloader)


    // same for draco if needed
  }
  startLoadings() {
    for(const asset of this.assets){
      if(asset.type==="glbModel"){
        this.loaders.gltfloader.load(asset.path, (file) => {
          this.singleAssetLoaded(asset, file);
        })
      } else if(asset.type==="videoTexture"){
        this.video = {};
        this.videoTexture = {};
        this.video[asset.name] = document.createElement("video");
        this.video[asset.name].src = asset.path;
        this.video[asset.name].muted = true;
        this.video[asset.name].playsInline = true;
        this.video[asset.name].autoplay = true;
        this.video[asset.name].loop = true;
        var isPlaying = this.video[asset.name].currentTime > 0 && 
          !this.video[asset.name].paused &&
          !this.video[asset.name].ended &&
          this.video[asset.name].readyState > this.video[asset.name].HAVE_CURRENT_DATA;

        if (!isPlaying) {
          this.video[asset.name].play();
        }

        this.videoTexture[asset.name] = new THREE.VideoTexture(
          this.video[asset.name]
        );

        // this.videoTexture[asset.name].flipY = false;
        this.videoTexture[asset.name].minFilter = THREE.NearestFilter;
        this.videoTexture[asset.name].magFilter = THREE.NearestFilter;
        this.videoTexture[asset.name].generateMipmaps = false;
        this.videoTexture[asset.name].encoding = THREE.sRGBEncoding;

        this.singleAssetLoaded(asset, this.videoTexture[asset.name]);
      } else if(asset.type==="imageTexture"){
        this.imageTexture = {};
        this.imageTexture[asset.name] = new THREE.TextureLoader().load(asset.path);
        this.singleAssetLoaded(asset, this.imageTexture[asset.name]);
      }
    }
  }

  singleAssetLoaded(asset, file) {
    this.items[asset.name] = file;
    this.loaded++

    // console.log("asset is loading", `${parseInt(this.loaded * 100/this.queue)}%`);
    if(this.loaded === this.queue){
      console.log("finished")
      this.emit("ready");
    }
  }
}
