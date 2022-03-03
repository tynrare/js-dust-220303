let guids = 0;

/**
 * @returns {string} uniq id
 */
function guid() {
  return "i" + guids++;
}

function Frame(action) {
  this.action = action;

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

  const stdin = app.stdin

  this.index = index;
  this.next = (key) => {
    if (Step.OPTIONS.SHOW_ONLY_ONE_PRINT) {
      this.frame?.hide();
    }

		let action = null;
		if (typeof key !== 'undefined') {
			action = stdin.named[key];
		} else {
			action = stdin.queue[this.index++];
		}

    if (action.classList.contains("dust-0")) {
      this.next();
      return;
    }
    this.frame = new Frame(action);
    this.frame.show();
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
        dapp.classList.add(styles[k]);
      }
    },
    "toggle-style": (styles) => {
      for (const k in styles) {
        dapp.classList.toggle(styles[k]);
      }
    },
    goto: (styles) => {
      app.step.jump(styles[0]);
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
 * @param {HTMLElement} face app face instance
 */
export default function Avessy(face) {
  // init data ---

  const stdin = {
    queue: [],
    named: {},
  };

  for (let i = 0; i < face.children.length; i++) {
    const element = face.children[i];
    if (!element.id) {
      stdin.queue.push(element);
    } else {
      stdin.named[element.id] = element;
    }
  }

  this.run = (frame = 0) => {
    this.dapp = document.querySelector("avessy.dapp");
    this.stdin = stdin;
    this.face = face;

    const input = new Input(this);
    this.step = new Step(this, frame);
    this.step.next();

    document.body.addEventListener("mousedown", (e) => {
      if (e.target.tagName === "BUTTON" || e.target.tagName === "ICON") {
        input.put(e.target.id, e.target.classList.value.split(" "));
      }

      if (e.target.classList.contains("reveal")) {
        this.step.next();
      }
    });
  };
}
