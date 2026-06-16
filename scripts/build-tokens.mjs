/**
 * sqrtDAO token build
 * ---------------------------------------------------------------------------
 * Reads the Figma DTCG export in /tokens and emits a single layered CSS file
 * (/src/app/tokens.css) of CSS custom properties:  primitive -> semantic -> component.
 *
 * The Figma "Token Importer" export stamps "px" onto values that are NOT pixels.
 * This script corrects those on the way out so the CSS is actually valid:
 *   - line-height        "1.1px"  -> 1.1     (unitless ratio)
 *   - letter-spacing-pct "-2px"   -> -0.02em (percentage -> em)
 *   - motion duration    "140px"  -> 140ms   (milliseconds)
 *
 * Run:  npm run tokens
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const read = (p) => JSON.parse(readFileSync(resolve(root, p), "utf8"));

const primitive = read("tokens/primitive.json");
const semantic = read("tokens/semantic.json");

/* ---------- helpers ---------------------------------------------------- */

// {color.amber.500} -> var(--color-amber-500)  ·  {radius.m} -> var(--radius-m)
const refToVar = (val) =>
  val.replace(/\{([^}]+)\}/g, (_, path) => `var(--${path.split(".").join("-")})`);

// flatten a DTCG subtree into [name, value] pairs, prefixing each key
function flatten(node, prefix, out = []) {
  for (const [key, val] of Object.entries(node)) {
    if (val && typeof val === "object" && "$value" in val) {
      out.push([`${prefix}-${key}`, val.$value]);
    } else if (val && typeof val === "object") {
      flatten(val, `${prefix}-${key}`, out);
    }
  }
  return out;
}

const emit = (pairs) =>
  pairs.map(([name, value]) => `  --${name}: ${value};`).join("\n");

/* ---------- PRIMITIVE --------------------------------------------------- */

const colorPairs = flatten(primitive.color, "color");
const spacePairs = flatten(primitive.space, "space");
const radiusPairs = flatten(primitive.radius, "radius");
const borderPairs = flatten(primitive["border-width"], "border-width");

const fontFamily = flatten(primitive.font.family, "font-family");
const fontWeight = flatten(primitive.font.weight, "font-weight"); // unitless ok
const fontSize = flatten(primitive.font.size, "font-size");

// FIX: line-height exported as "1.1px" -> unitless 1.1
const lineHeight = flatten(primitive.font["line-height"], "font-line-height").map(
  ([n, v]) => [n, String(parseFloat(v))]
);
// FIX: letter-spacing-pct exported as "-2px" (means -2%) -> em
const letterSpacing = flatten(
  primitive.font["letter-spacing-pct"],
  "font-letter-spacing"
).map(([n, v]) => [n, `${parseFloat(v) / 100}em`]);

// FIX: motion duration exported as "140px" -> "140ms"
const duration = flatten(primitive.motion["duration-ms"], "motion-duration").map(
  ([n, v]) => [n, `${parseFloat(v)}ms`]
);
const easing = flatten(primitive.motion.easing, "motion-easing");
const shadow = flatten(primitive.shadow, "shadow");

const primitiveCss = [
  colorPairs, spacePairs, radiusPairs, borderPairs,
  fontFamily, fontWeight, fontSize, lineHeight, letterSpacing,
  duration, easing, shadow,
].map(emit).join("\n");

/* ---------- SEMANTIC ---------------------------------------------------- */

const semGroups = ["bg", "text", "border", "action", "state", "link", "radius", "space"];
const semanticPairs = [];
for (const g of semGroups) {
  if (!semantic[g]) continue;
  for (const [name, val] of flatten(semantic[g], `sqrt-${g}`)) {
    semanticPairs.push([name, refToVar(val)]);
  }
}
const semanticCss = emit(semanticPairs);

/* ---------- COMPONENT: button ------------------------------------------ */
/* Authored layer. Maps the Button's expected variable names onto the
   generated semantic + primitive tokens above. Two values are flagged for
   sign-off (see the project README): focus ring + button corner radius.     */

const componentCss = `  /* --- naming bridge: Figma 'pressed' -> CSS 'press' (button contract) --- */
  --sqrt-action-primary-press: var(--sqrt-action-primary-pressed);
  --sqrt-action-secondary-press: var(--sqrt-action-secondary-pressed);

  /* --- button --- */
  --btn-font-family: var(--font-family-body), system-ui, sans-serif;
  --btn-font-weight: var(--font-weight-medium);
  --btn-letter-spacing: 0.02em;                 /* button type: +2% */
  --btn-line-height: 24px;
  --btn-border-width: var(--border-width-hairline);
  --btn-radius: var(--sqrt-radius-card);        /* 8px — SIGN-OFF: interactive radius is 2px */
  --btn-transition: var(--motion-duration-fast) var(--motion-easing-standard);
  --btn-inner-shadow: -1px 1px 7px rgba(0, 0, 0, 0.16); /* component-only, not in token export */

  /* large */
  --btn-l-height: 48px;
  --btn-l-pad: var(--space-12);
  --btn-l-gap: var(--space-8);
  --btn-l-font: var(--font-size-body-l);
  --btn-l-icon: 14px;

  /* medium */
  --btn-m-height: 40px;
  --btn-m-pad: var(--space-8);
  --btn-m-gap: var(--space-6);
  --btn-m-font: var(--font-size-body);
  --btn-m-icon: 14px;`;

/* ---------- WRITE ------------------------------------------------------- */

const out = `/* ============================================================
   sqrtDAO design tokens — GENERATED. Do not edit by hand.
   Source: /tokens/*.json (Figma export)   Build: npm run tokens
   ============================================================ */

:root {
  /* ---------------- PRIMITIVE ---------------- */
${primitiveCss}

  /* ---------------- SEMANTIC ----------------- */
${semanticCss}

  /* ---------------- COMPONENT ---------------- */
${componentCss}
}
`;

writeFileSync(resolve(root, "src/app/tokens.css"), out);
console.log("✓ src/app/tokens.css written");
console.log(
  `  primitive: ${primitiveCss.split("\n").length} vars · semantic: ${semanticPairs.length} vars`
);
