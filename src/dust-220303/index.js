import Avessy from "./avessy.js";

function main() {
  window.addEventListener("hashchange", () => {
    document.location.reload();
  });

  const hash = document.location.hash;

  // --- avessy
  const args = hash.match(/\#(\S+)(?:-(\d+))?/);
  const avessy = new Avessy(main);
  avessy.init({ key: args[1] });
  avessy.run();

  const globals = new Avessy(main);
  globals.init({ key: "avessy_globals" }).run();
}

main();
