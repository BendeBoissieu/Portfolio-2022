import * as THREE from "three";
import Experience from "../Experience";
import GSAP from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";
import ASScroll from "@ashthornton/asscroll";

const asscroll = new ASScroll()

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
        page.style.overflow = "visible";
        page.style.position = "relative";

        if (
          !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
              navigator.userAgent
          )
        ) {
            this.setSmoothScroll();
        }
        this.setScrollTrigger();

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
      //this.asscroll = this.setupASScroll();
    }

    setScrollTrigger(){
      // to move the item with a time
      // this.timeline.to(this.island.position, {
      //   x: 5,
      //   duration: 20,
      // })

      // Top top, first one for the marker and second one the page
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
                    x: 1.4,
                    y: 1.4,
                    z: 1.4,
                },
                "same"
            )

          // Third section -----------------------------------------
          this.thirdMoveTimeline = new GSAP.timeline({
            scrollTrigger: {
                trigger: ".third-move",
                start: "top top",
                end: "bottom bottom",
                scrub: 0.6,
                invalidateOnRefresh: true,
            },
          }).to(this.camera.orthographicCamera.position, {
                y: 1.5,
                x: -4.1,
            });
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
}
