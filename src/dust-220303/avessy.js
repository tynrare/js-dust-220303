let guids = 0;

/**
 * @returns {string} uniq id
 */
function guid() {
  return "i" + guids++;
}

/**
 * @param {Avessy} app .
 * @param {HTMLElement} action .
 */
function Frame(app, action) {
  this.app = app;
  this.action = action;

  this.act = (act) => {
    switch (act.tagName) {
      case "CMD":
        this.app.input.put(act.id, act.classList.value.split(" "));
        break;
      case "PRINT":
        this.show();
        break;
    }
  };

  this.sequence = (action) => {
    for (let i = 0; i < action.children.length; i++) {
      const act = action.children[i];
      this.act(act);
    }
  };

  this.execute = () => {
    switch (this.action.tagName) {
      case "GLUE":
        this.sequence(this.action);
        break;
      case "SEQUENCE":
        this.sequence(this.action);
        this.app.step.next();
        break;
      case "CMD":
        this.act(this.action);
        this.app.step.next();
        break;
      case "PRINT":
        this.act(this.action);
        break;
    }
  };

  this.show = () => {
    action.classList.add("reveal");
  };

  this.hide = () => {
    action.classList.remove("reveal");
  };
}

/**
 * @param {Avessy} app .
 * @param {number} [index=0] step index
 */
function Step(app, index = 0) {
  this.app = app;

  const stdin = app.stdin;

  this.index = index;
  this.next = (key) => {
    let action = null;
    if (typeof key !== "undefined") {
      action = stdin.named[key];
    } else {
      action = stdin.queue[this.index++];
    }

    if (!action) {
      return;
    }

    if (Step.OPTIONS.SHOW_ONLY_ONE_PRINT) {
      this.frame?.hide();
    }

    if (action.classList.contains("dust-0")) {
      this.next();
      return;
    }

    this.frame = new Frame(this.app, action);
    this.frame.execute();
  };

  this.jump = (key) => {
    const frameA = this.frame;
    this.next(key);
    const frameB = this.frame;

    //frameB.action.removeFromParent(
  };
}

Step.OPTIONS = {
  SHOW_ONLY_ONE_PRINT: false,
};

function Input(app) {
  this.app = app;
  const dapp = app.dapp;

  const actions = {
    "add-style": (styles) => {
      for (const k in styles) {
        console.log("adding..", styles[k]);
        dapp.classList.add(styles[k]);
      }
    },
    "remove-style": (styles) => {
      for (const k in styles) {
        console.log("removing..", styles[k]);
        dapp.classList.remove(styles[k]);
      }
    },
    "toggle-style": (styles) => {
      for (const k in styles) {
        dapp.classList.toggle(styles[k]);
      }
    },
    goto: (args) => {
      app.step.jump(args[0]);
    },
    hide: (args) => {
      const key = args[0];
      const action = app.stdin.named[key];
      const frame = new Frame(this.app, action);
      frame.hide();
    },
    "start-avessy": (args) => {
      document.location.hash = "#" + args[0];
      this.app.reset();
    },
    "add-option": (args) => {
      Step.OPTIONS[args[0]] = true;
    },
    "remove-option": (args) => {
      Step.OPTIONS[args[0]] = false;
    },
  };

  this.put = (key, args) => {
    if (!key?.length) {
      return;
    }

    const action = actions[key];
    if (action) {
      action(args);
    }
  };
}

/**
 * @param {function} reset .
 */
export default function Avessy(reset) {
  // init data ---

  this.reset = reset;

  guids = 0;

  const stdin = {
    queue: [],
    named: {},
  };

  this.stop = () => {
    document.body.removeEventListener("mousedown", this._click);
    this.face.classList.remove("active");
    this.step.frame?.hide();
  };

  this.reset = () => {
    this.stop();
    reset();
  };

  this.init = ({ key = "main" } = {}) => {
    try {
      stdin.queue = [];
      stdin.named = {};

      const face = document.querySelector("avessy#" + key);
      this.face = face;

      this.merge(face);
    } catch (error) {
      console.error("Avessy.init error:", error);
    }

    return this;
  };

  this.merge = (face) => {
    for (let i = 0; i < face.children.length; i++) {
      const element = face.children[i];

      element.classList.remove("reveal");

      if (!element.classList.contains("sidekick")) {
        stdin.queue.push(element);
      } else {
        stdin.named[element.id] = element;
      }
    }
  };

  this._click = (e) => {
    const args = (
      e.target.getAttribute("arguments") ?? e.target.classList.value
    ).split(" ");
    if (e.target.tagName === "BUTTON" || e.target.tagName === "ICON") {
      this.input.put(e.target.id, args);
    }

    if (
      e.target.classList.contains("reveal") ||
      e.target.parentNode.classList.contains("reveal")
    ) {
      this.step.next();
    }
  };

  this.run = (frame = 0) => {
    try {
      this.dapp = document.querySelector("avessy.dapp");
      this.stdin = stdin;

      this.input = new Input(this);
      this.step = new Step(this, frame);
      this.step.next();

      this.face.classList.add("showtime");
      this.face.classList.add("active");

      document.body.addEventListener("mousedown", this._click);
    } catch (err) {
      console.error(err);
    }

    return this;
  };
}
