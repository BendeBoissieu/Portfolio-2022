import * as THREE from "three";
import Experience from "../Experience";
import GSAP from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger.js";
// import GUI from "lil-gui";
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
        this.floor = this.experience.world.floor.plane;
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

        // Gui console
        // this.gui = new GUI();
        // this.obj = {
        //   position: {
        //     x: this.camera.orthographicCamera.position.x,
        //     y: this.camera.orthographicCamera.position.y,
        //     z: this.camera.orthographicCamera.position.z
        //   },
        //   scale: this.island.scale.x,
        // };
        // this.setGUI();

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
                  width: this.sizes.width,
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
      ScrollTrigger.matchMedia({
        //Desktop
        "(min-width: 969px)": () => {
          this.island.scale.set(0.7, 0.7, 0.7);
          this.camera.orthographicCamera.position.set(0, 5, 8);
          this.island.position.set(0, 0, 0);
          // Section 1
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
            this.camera.orthographicCamera.position,
            { x: 0, y: 5, z: 8 },
            {
              x: () => {
                return - this.sizes.width * 0.0014;
              }
            }
          )
          // // Section 2
          this.secondMoveTimeline = new GSAP.timeline({
            scrollTrigger: {
                trigger: ".second-move",
                start: "top top",
                end: "75%+=100px bottom",
                markers: false,
                scrub: 0.6,
                invalidateOnRefresh: true,
            },
          })
            .to(
              this.camera.orthographicCamera.position,
              {
                  x: () => {
                    return this.sizes.width * 0.0018;
                  },
                  y: () => {
                      return 5.5;
                  },
              },
              "same"
            )
            .to(
              this.floor.position,
              {
                y: () => {
                  return -1.2;
                },
              },
              "same"
            )
            .to(
              this.island.scale,
              {
                x: () => {
                  return (this.sizes.height * 2 / this.sizes.width);
                },
                y: () => {
                  return (this.sizes.height * 2 / this.sizes.width);
                },
                z: () => {
                    return (this.sizes.height * 2 / this.sizes.width);
                },
              },
              "same"
            ),

          // Section 3
          this.thirdMoveTimeline = new GSAP.timeline({
            scrollTrigger: {
                trigger: ".third-move",
                start: "-10% top",
                end: "50%+=100px bottom",
                scrub: 0.6,
                markers: false,
                invalidateOnRefresh: true,
            },
          })
            .to(
              this.island.scale,
              {
                x: () => {
                  return (this.sizes.height * 40 / this.sizes.width);
                },
                y: () => {
                  return (this.sizes.height * 40 / this.sizes.width);
                },
                z: () => {
                    return (this.sizes.height * 40 / this.sizes.width);
                },
              },
              "same"
            )
            .to(
              this.camera.orthographicCamera.position,
              {
                  x: () => {
                    return -this.sizes.width * 0.0015;
                  },
                  y: () => {
                      return 5.5;
                  },
              },
              "same"
            )
            .to(
              this.floor.position,
              {
                y: () => {
                  return -9;
                },
              },
              "same"
            ),

          // Section 4
          this.fourthMoveTimeline = new GSAP.timeline({
            scrollTrigger: {
                trigger: ".fourth-move",
                start: "top top",
                end: "bottom bottom",
                scrub: 0.6,
                invalidateOnRefresh: true,
            },
          })
            .to(
              this.island.scale,
              {
                x: () => {
                  return (this.sizes.height * 1 / this.sizes.width);
                },
                y: () => {
                  return (this.sizes.height * 1 / this.sizes.width);
                },
                z: () => {
                    return (this.sizes.height * 1 / this.sizes.width);
                },
              },
              "same"
            )
            .to(
              this.camera.orthographicCamera.position,
              {
                  x: () => {
                    return this.sizes.width * 0.0016;
                  },
                  y: () => {
                      return 5.5;
                  },
              },
              "same"
            )
            .to(
              this.island.position,
              {
                y: () => {
                  return this.sizes.width * 0.0004;
                },
              },
              "same"
            )
            .to(
              this.floor.position,
              {
                y: () => {
                  if (this.sizes.width < 1900) {
                    return 0.03
                  } else {
                    return 0.3
                  }
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
          this.island.position.set(0, 0, 0.8);
          this.camera.orthographicCamera.position.set(0, 2, 4);

          // Section 1
          this.firstMoveTimeline = new GSAP.timeline({
              scrollTrigger: {
                  trigger: ".first-move",
                  start: "top top",
                  end: "bottom bottom",
                  scrub: 0.6,
                  // invalidateOnRefresh: true,
              },
          })
            .to(
              this.island.scale,
              {
                  x: 3,
                  y: 3,
                  z: 3,
              },
              "same"
            )
            .to(
              this.floor.position,
              {
                y: () => {
                  return -9;
                },
              },
              "same"
            )
            .to(
              this.island.position,
              {
                x: () => {
                  return 0.8;
                },
              },
              "same"
            )

          // Section 2
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
                  this.island.scale,
                  {
                      x: 10,
                      y: 10,
                      z: 10,
                  },
                  "same"
              )
              .to(
                this.island.position,
                {
                  x: () => {
                    return 0;
                  },
                },
                "same"
              )


            // Section 3
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
              this.island.scale,
              {
                  x: 1,
                  y: 1,
                  z: 1,
              },
              "same"
            )
            .to(
              this.island.position,
              {
                x: () => {
                  return -1;
                },
                z: () => {
                  return 2;
                },
              },
              "same"
            )
        }
      })
    }

    resize() {
    }

    update() {
    }

    // setGUI() {
    //   console.log(this.camera.orthographicCamera.position.x);
    //   // this.gui.add( this.obj );
    //   this.folder = this.gui.addFolder( 'scale' );
    //   this.gui.add( this.obj, 'scale' ).onChange(() => {
    //     this.island.scale.x = this.obj.scale ;
    //     this.island.scale.y = this.obj.scale ;
    //     this.island.scale.z = this.obj.scale ;
    //   });
    //   this.folder = this.gui.addFolder( 'camera' );
    //   this.folder.add( this.obj.position, 'x' ).onChange(() => {
    //       this.camera.orthographicCamera.position.x = this.obj.position.x ;
    //   });
    //   this.folder.add( this.obj.position, 'y' ).onChange(() => {
    //     this.camera.orthographicCamera.position.y = this.obj.position.y ;
    //   });
    //   this.folder.add( this.obj.position, 'z' ).onChange(() => {
    //     this.camera.orthographicCamera.position.z = this.obj.position.z ;
    //   });
    // }
}
