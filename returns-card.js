// Counts the rate up in sync with the pill animation and wires the pause button.
const CYCLE_MS = 6000;
const COUNT_START = 0.08; // fraction of the cycle where counting starts
const COUNT_END = 0.4; // fraction of the cycle where the target is reached

for (const card of document.querySelectorAll(".returns-card")) {
  const rateEl = card.querySelector(".returns-card__rate");
  const button = card.querySelector(".returns-card__pause");
  const target = Number(rateEl.dataset.rate);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const show = (value) => {
    rateEl.textContent = `${value.toFixed(2)}%`;
  };

  if (reduceMotion) {
    show(target);
    card.classList.add("is-paused");
    button.hidden = true;
    continue;
  }

  let elapsed = 0;
  let last = performance.now();
  let paused = false;

  const tick = (now) => {
    if (!paused) elapsed = (elapsed + (now - last)) % CYCLE_MS;
    last = now;
    const t = elapsed / CYCLE_MS;
    const p = Math.min(Math.max((t - COUNT_START) / (COUNT_END - COUNT_START), 0), 1);
    const eased = 1 - Math.pow(1 - p, 3);
    show(target * eased);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  button.addEventListener("click", () => {
    paused = !paused;
    card.classList.toggle("is-paused", paused);
    button.setAttribute("aria-label", paused ? "Play animation" : "Pause animation");
    button.setAttribute("aria-pressed", String(paused));
  });
}
