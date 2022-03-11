import WebglWrapper from "./WebglWrapper";
import frag from './shader.frag';
import vert from './shader.vert';

class App {
  constructor() {
    this.active = true;
    
  }

  run() {
    window.addEventListener("resize", () => {
		  this.webgl.glea.resize();
    });
    this.webgl.run();
    this.loop(0);
  }

  init() {
    this.webgl = new WebglWrapper();
    this.webgl.init(frag, vert);

    return this;
  }

  loop(timestamp) {
    this.webgl.update(timestamp);

    if (this.active) {
      requestAnimationFrame((timestamp) => this.loop(timestamp));
    }
  }
}

/**
 * Entry point
 */
function main() {
  const app = new App();
  app.init().run();
}

main();
