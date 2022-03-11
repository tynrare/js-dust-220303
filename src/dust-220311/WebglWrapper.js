import GLea from "glea";

export default class WebglWrapper {
  constructor() {
    this.pointer = {
      x: 0,
      y: 0,
      z: 0
    }
  }

  init(fragment, vertex) {
    const glea = new GLea({
      shaders: [GLea.fragmentShader(fragment), GLea.vertexShader(vertex)],
      buffers: {
        // create a position attribute bound
        // to a buffer with 4 2D coordinates
        // this is what GLea provides by default if you omit buffers in the constructor
        position: GLea.buffer(2, [1, 1, -1, 1, 1, -1, -1, -1]),
      },
    }).create();

    this.glea = glea;

    return this;
  }

  run() {
    this.glea.resize();
    document.addEventListener('mousemove', (e) => {
      this.pointer.x = e.clientX;
      this.pointer.y = window.innerHeight - e.clientY;
    })
    document.addEventListener('mousedown', (e) => {
      this.pointer.z = 1;
    })
    document.addEventListener('mouseup', (e) => {
      this.pointer.z = 0;
    })
  }

  update(time) {
    const { gl, width, height } = this.glea;
    this.glea.clear();
    this.glea.uniV("resolution", [width, height]);
    this.glea.uniV("pointer", [this.pointer.x, this.pointer.y, this.pointer.z]);
    this.glea.uni("time", time * 1e-3);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}
