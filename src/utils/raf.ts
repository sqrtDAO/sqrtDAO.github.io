// One shared requestAnimationFrame loop for all JS-driven motion on the page.
// Runs only while something is subscribed; dt is capped so a backgrounded tab doesn't jump.
type Tick = (dt: number, now: number) => void;

const ticks = new Set<Tick>();
let frame = 0;
let last = 0;

const loop = (now: number) => {
  const dt = last ? Math.min(now - last, 64) : 16;
  last = now;
  ticks.forEach((tick) => tick(dt, now));
  frame = ticks.size ? requestAnimationFrame(loop) : 0;
  if (!frame) last = 0;
};

export const addTick = (tick: Tick) => {
  ticks.add(tick);
  if (!frame) frame = requestAnimationFrame(loop);
  return () => {
    ticks.delete(tick);
  };
};
