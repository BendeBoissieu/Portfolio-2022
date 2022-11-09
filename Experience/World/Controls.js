import * as THREE from "three";
import Experience from "../Experience";
import GSAP from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger.js";
import GUI from "lil-gui";
// import ASScroll from "@ashthornton/asscroll";

// const asscroll = new ASScroll()

export default class Controls {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;

        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.camera = this.experience.camera;
        this.world = this.experience.world;
        this.island = this.experience.world.island.actualIsland;
        this.sizes = this.experience.sizes;

        GSAP.registerPlugin(ScrollTrigger);
        let page = document.querySelector(".page")
        page.style.overflow = "auto";
        page.style.height = "100%";

        // if (
        //   !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        //       navigator.userAgent
        //   )
        // ) {
        //     this.setSmoothScroll();
        // }
        this.setTrigger();

        this.gui = new GUI();
        this.obj = {
          position: {
            x: this.camera.orthographicCamera.position.x,
            y: this.camera.orthographicCamera.position.y,
            z: this.camera.orthographicCamera.position.z
          },
          scale: this.island.scale.x,
        };
        this.setGUI();

    }

    setupASScroll() {
      // https://github.com/ashthornton/asscroll
      const asscroll = new ASScroll({
          ease: 0.5,
          disableRaf: true,
      });

      GSAP.ticker.add(asscroll.update);

      ScrollTrigger.defaults({
          scroller: asscroll.containerElement,
      });

      ScrollTrigger.scrollerProxy(asscroll.containerElement, {
          scrollTop(value) {
              if (arguments.length) {
                  asscroll.currentPos = value;
                  return;
              }
              return asscroll.currentPos;
          },
          getBoundingClientRect() {
              return {
                  top: 0,
                  left: 0,
                  width: window.innerWidth,
                  height: window.innerHeight,
              };
          },
          fixedMarkers: true,
      });

      asscroll.on("update", ScrollTrigger.update);
      ScrollTrigger.addEventListener("refresh", asscroll.resize);

      requestAnimationFrame(() => {
          asscroll.enable({
              newScrollElements: document.querySelectorAll(
                  ".gsap-marker-start, .gsap-marker-end, [asscroll]"
              ),
          });
      });
      return asscroll;
    }

    setSmoothScroll() {
      this.asscroll = this.setupASScroll();
    }

    // 1st version withtout matchMedia
    // Top top, first one for the marker and second one the page
    setPath(){
      this.timeline = new GSAP.timeline();
      this.timeline.to(this.island.position, {
        x: () => { return this.sizes.width * 0.0017 },
        scrollTrigger: {
          trigger: ".first-move",
          markers: true,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          invalidateOnRefresh: true
        }
      })
    }

    setTrigger(){
      console.log(this.sizes.height)
      ScrollTrigger.matchMedia({
        //Desktop
        "(min-width: 969px)": () => {
          this.island.scale.set(0.7, 0.7, 0.7);
          this.camera.orthographicCamera.position.set(0, 5, 8);
          this.island.position.set(0, 0, 0);
          // 1st move
          this.firstMoveTimeline = new GSAP.timeline({
            scrollTrigger: {
                trigger: ".first-move",
                start: "top top",
                end: "bottom bottom",
                scrub: 0.6,
                markers: false,
                invalidateOnRefresh: true,
            },
          });
          this.firstMoveTimeline.fromTo(
            this.island.position,
            { x: 0, y: 0, z: 0 },
            {
                x: () => {
                    return this.sizes.width * 0.0014;
                }
            },
          )

          // 2nd move
          this.secondMoveTimeline = new GSAP.timeline({
            scrollTrigger: {
                trigger: ".second-move",
                start: "top top",
                end: "bottom bottom",
                scrub: 0.6,
                invalidateOnRefresh: true,
            },
          })
            .to(
                this.island.position,
                {
                    x: () => {
                      return - this.sizes.width * 0.0012;
                    },
                    z: () => {
                        return this.sizes.height * 0.0032;
                    },
                },
                "same"
            )
            .to(
              this.island.scale,
              {
                x: () => {
                  return 3;
                },
                y: () => {
                  return 3;
                },
                z: () => {
                    return 3;
                },
              },
              "same"
            ),

          // Third section -----------------------------------------
          this.thirdMoveTimeline = new GSAP.timeline({
            scrollTrigger: {
                trigger: ".third-move",
                start: "top top",
                end: "bottom bottom",
                scrub: 0.6,
                invalidateOnRefresh: true,
            },
          })
            .to(
                this.camera.orthographicCamera.position,
                {
                  x: () => {
                    return - this.sizes.width * 0.00175
                  }
                },
                "same"
            )
            .to(
              this.island.scale,
              {
                x: () => {
                  return 17;
                },
                y: () => {
                  return 17;
                },
                z: () => {
                    return 17;
                },
              },
              "same"
            )
        },

        // Mobile
        "(max-width: 968px)": () => {
          // console.log("fired mobile");

          // Resets
          this.island.scale.set(0.3, 0.3, 0.3);
          this.island.position.set(0, 0, 0);
          this.camera.orthographicCamera.position.set(0, 2, 4);

          // First section -----------------------------------------
          this.firstMoveTimeline = new GSAP.timeline({
              scrollTrigger: {
                  trigger: ".first-move",
                  start: "top top",
                  end: "bottom bottom",
                  scrub: 0.6,
                  // invalidateOnRefresh: true,
              },
          }).to(this.island.scale, {
              x: 0.6,
              y: 0.6,
              z: 0.6,
          });
        }
      })
    }

    resize() {
    }

    update() {
    }

    setGUI() {
      console.log(this.camera.orthographicCamera.position.x);
      // this.gui.add( this.obj );
      this.folder = this.gui.addFolder( 'scale' );
      this.gui.add( this.obj, 'scale' ).onChange(() => {
        this.island.scale.x = this.obj.scale ;
        this.island.scale.y = this.obj.scale ;
        this.island.scale.z = this.obj.scale ;
      });
      this.folder = this.gui.addFolder( 'camera' );
      this.folder.add( this.obj.position, 'x' ).onChange(() => {
          this.camera.orthographicCamera.position.x = this.obj.position.x ;
      });
      this.folder.add( this.obj.position, 'y' ).onChange(() => {
        this.camera.orthographicCamera.position.y = this.obj.position.y ;
      });
      this.folder.add( this.obj.position, 'z' ).onChange(() => {
        this.camera.orthographicCamera.position.z = this.obj.position.z ;
      });
    }
}
