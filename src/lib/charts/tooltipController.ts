export interface TooltipRow {
  label: string;
  value: string;
}

export interface TooltipController {
  show(rows: TooltipRow[], x: number, y: number, boundsWidth: number, boundsHeight: number): void;
  hide(): void;
  destroy(): void;
}

const ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};
const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ESCAPE_MAP[c]);

/**
 * Shared imperative tooltip: one DOM node, mutated directly on hover.
 * Never route crosshair/pointer moves through React state — that's the
 * whole point of keeping this outside the component tree.
 */
export function createTooltipController(container: HTMLElement): TooltipController {
  const el = document.createElement("div");
  el.className = "chart-tooltip";
  container.appendChild(el);

  function show(rows: TooltipRow[], x: number, y: number, boundsWidth: number, boundsHeight: number) {
    el.innerHTML = rows
      .map(
        (r) =>
          `<div class="chart-tooltip__row"><span>${escapeHtml(r.label)}</span><b>${escapeHtml(r.value)}</b></div>`
      )
      .join("");
    el.classList.add("chart-tooltip--on");

    const tw = el.offsetWidth || 236;
    const th = el.offsetHeight || 128;
    let left = x + 18;
    if (left + tw > boundsWidth - 8) left = x - 18 - tw;
    let top = y - th - 14;
    if (top < 8) top = y + 18;
    if (top + th > boundsHeight - 8) top = boundsHeight - 8 - th;
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
  }

  function hide() {
    el.classList.remove("chart-tooltip--on");
  }

  function destroy() {
    el.remove();
  }

  return { show, hide, destroy };
}
