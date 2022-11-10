import { EventEmitter } from "events";

export default class Screen extends EventEmitter {
    constructor() {
        super();
        this.links = document.querySelectorAll(".link");
        this.links.forEach(link => {
          this.setEventListeners(link);
        })
    }

    setEventListeners(link) {
        link.addEventListener("mouseover", () => {
          this.link = link.innerHTML
          this.emit("hoverLink", this.link);
        });
    }
}