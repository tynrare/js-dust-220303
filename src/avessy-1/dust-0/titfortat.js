const bots = {
  // By Robert Axelrod
  niceguy: {
    steps: 0,
    state: 0,
    resources: 100,
    /**
     * @returns {number} 0 for cooperate 1 for betray
     */
    play(action) {
      // Кооперируется на первом шаге
      if (bots.niceguy.steps++ === 0) {
        return 0;
      }

      // Копирует все последующие шаги
      const cache = bots.niceguy.state;
      bots.niceguy.state = action;

      return cache;
    },
  },
  randomguy: {
    resources: 100,
    play() {
      return Math.random() > 0.5 ? 0 : 1;
    },
  },
};

function log(message) {
  document.getElementById("log").innerHTML = message;
}

function playTitfortat(args) {
  console.log("Play PD with arguments:", args);

  // #draft
  const calculate = (playerA, playerB) => {
    console.log("Calculate PD results for:", playerA, playerB);
    let resultA = 0;
    let resultB = 0;

    // Both cooperate
    if (playerA === 0 && playerB === 0) {
      log("Play PD. Both cooperated. +10 resources");
      resultA = resultB = 10;
    }

    // Only playerA cooperate
    if (playerA === 0 && playerB === 1) {
      log("Play PD. Only player cooperated. -15 resources");
      resultA = -15;
      resultB = 15;
    }

    // Only playerB cooperate
    if (playerB === 0 && playerA === 1) {
      log("Play PD. Only bot cooperated. +15 resources");
      resultA = 15;
      resultB = -15;
    }

    // Only playerB cooperate
    if (playerB === 1 && playerA === 1) {
      log("Play PD. No one cooperated. +3 resources");
      resultA = 3;
      resultB = 3;
    }

    return {
      resultA,
      resultB,
    };
  };

  // ---
  const html = document.getElementById("titfortat_resouces");
  const player = {
    get resources() {
      return Number(html.innerHTML);
    },
    set resources(value) {
      html.innerHTML = value;
    },
  };
  // ---

  const bot = bots[args[1]];
  const playerAction = Number(args[2]);
  const botAction = bot.play(playerAction);

  const result = calculate(playerAction, botAction);
  player.resources += result.resultA;
  bot.resources += result.resultB;
}

function addClickListener(element, cmd) {
  const args = cmd.split(" ");
  element.addEventListener("mousedown", () => {
    switch (args[0]) {
      case "toggle_display":
        document.getElementById(args[1]).classList.toggle("hidden");
        break;
      case "titfortat":
        playTitfortat(args);
        break;
    }
  });
}

function parse(avessy) {
  for (let i = 0; i < avessy.children.length; i++) {
    const child = avessy.children[i];
    const cmd = child.getAttribute("cmd");
    if (cmd) {
      addClickListener(child, cmd);
    }
    parse(child);
  }
}

function main() {
  const db = document.querySelector("db avessy#titfortat");
  parse(db);
}

window.addEventListener("DOMContentLoaded", main);
