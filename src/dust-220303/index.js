import Avessy from "./avessy.js";

let face = null;

/**
 * Cleans dust
 */
function showtime() {
  face.classList.add("showtime");
}

function main() {
  face = document.querySelector("avessy#main");

  const hash = document.location.hash;

  window.addEventListener("popstate", () => {
    window.location.reload();
  });

  // --- avessy
  const match = hash.match(/\#(avessy)(?:-(\d+))?/);
  if (match[0]) {
    showtime();
    const avessy = new Avessy(face);
    avessy.run(match[2] ?? 0);
  }
}

main();
