/**
 * Converts a Figma DTCG variable export (rich format: color objects with
 * {colorSpace,components,alpha,hex}, aliasData for semantic refs, bare
 * numeric $values with no units) into the older, flatter DTCG shape that
 * scripts/build-tokens.mjs expects (plain "#hex" color strings, "{group.path}"
 * semantic references, unit-bearing dimension strings).
 *
 * Mechanical only — every emitted value is derived from a field already
 * present in the source export, never typed by hand.
 *
 * Decisions baked in here (approved 2026-08-25, see conversation):
 *  1. color.support["wild violet"].* is written to color.charts.epochs.*
 *     instead (matches the path src/lib/charts/bucketColor.ts and
 *     DistributionDetail.tsx hardcode as `var(--color-charts-epochs-N)`);
 *     support["wild violet"] itself is dropped (its key contains a space,
 *     which is not a legal CSS custom-property name segment).
 *  2. The semantic export's top-level `charts` group is dropped — it's not
 *     in build-tokens.mjs's semGroups walk list, and its alias targets point
 *     at the now-relocated wild-violet path.
 *  3. Primitive colors with alpha < 1 are re-encoded as 8-digit hex
 *     (RRGGBBAA), matching the old file's convention, instead of the new
 *     export's separate hex + alpha fields.
 *  4. Bare-number dimensions (space/radius/border-width/font.size) get "px"
 *     appended, since build-tokens.mjs emits these groups verbatim with no
 *     unit math of its own.
 *  5. state.live / state.info are converted as literal repoints to whatever
 *     the new export's aliasData says (amber-signal-text / blue) — the
 *     Status-component color overlap this creates is a separate, deferred
 *     reconciliation task.
 *
 * Run:  node scripts/convert-figma-export.mjs [primitiveInPath] [semanticInPath] [outDir]
 * Defaults: tokens/_incoming/primitive.raw.json, tokens/_incoming/semantic.raw.json, tokens/_new
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const [primitiveInPath, semanticInPath, outDir] = [
  process.argv[2] ?? "tokens/_incoming/primitive.raw.json",
  process.argv[3] ?? "tokens/_incoming/semantic.raw.json",
  process.argv[4] ?? "tokens/_new",
];

const read = (p) => JSON.parse(readFileSync(resolve(root, p), "utf8"));
const primitiveRaw = read(primitiveInPath);
const semanticRaw = read(semanticInPath);

/* ---------- shared helpers ---------------------------------------------- */

const round6 = (n) => Math.round(n * 1e6) / 1e6;

const toCssColor = ({ hex, alpha }) => {
  const h = hex.toLowerCase();
  if (alpha === undefined || alpha >= 1) return h;
  const a = Math.round(alpha * 255).toString(16).padStart(2, "0");
  return `${h}${a}`;
};

const isLeaf = (val) => val && typeof val === "object" && "$value" in val;

/* ---------- PRIMITIVE: color tree (recursive, hex/alpha -> string) ------ */

function convertColorTree(node) {
  const out = {};
  for (const [key, val] of Object.entries(node)) {
    if (isLeaf(val)) {
      out[key] = { $type: "color", $value: toCssColor(val.$value) };
    } else {
      out[key] = convertColorTree(val);
    }
  }
  return out;
}

const primitiveColor = convertColorTree(primitiveRaw.color);

// decision 1: relocate support["wild violet"] -> charts.epochs
const wildViolet = primitiveRaw.color.support?.["wild violet"];
if (!wildViolet) {
  throw new Error("Expected color.support['wild violet'] in primitive export — not found, aborting rather than guessing.");
}
const chartsEpochs = {};
for (const [step, entry] of Object.entries(wildViolet)) {
  chartsEpochs[step] = { $type: "color", $value: toCssColor(entry.$value) };
}
delete primitiveColor.support["wild violet"];
primitiveColor.charts = { epochs: chartsEpochs };

/* ---------- PRIMITIVE: dimension groups (bare number -> "<n>px") -------- */

function pxify(node) {
  const out = {};
  for (const [key, val] of Object.entries(node)) {
    if (isLeaf(val)) {
      out[key] = { $type: "dimension", $value: `${val.$value}px` };
    } else {
      out[key] = pxify(val);
    }
  }
  return out;
}

/* ---------- PRIMITIVE: font.weight (bare number -> numeric string) ------ */

function stringifyPlain(node) {
  const out = {};
  for (const [key, val] of Object.entries(node)) {
    if (isLeaf(val)) {
      out[key] = { $type: "dimension", $value: String(val.$value) };
    } else {
      out[key] = stringifyPlain(val);
    }
  }
  return out;
}

/* ---------- PRIMITIVE: line-height / letter-spacing-pct / duration-ms --- */
/* build-tokens.mjs's own FIX step (parseFloat, optional /100, unit suffix)
   still runs on these — it tolerates a clean numeric string exactly as well
   as the old exporter's buggy "1.1px"/"−2px"/"140px" strings, so no unit is
   added here. Only float noise from Figma's internal precision is rounded. */

function roundedStringify(node) {
  const out = {};
  for (const [key, val] of Object.entries(node)) {
    if (isLeaf(val)) {
      out[key] = { $type: "dimension", $value: String(round6(val.$value)) };
    } else {
      out[key] = roundedStringify(val);
    }
  }
  return out;
}

/* ---------- PRIMITIVE: string leaves (family/easing/shadow) passthrough - */

function stringLeaf(node) {
  const out = {};
  for (const [key, val] of Object.entries(node)) {
    if (isLeaf(val)) {
      out[key] = { $type: "string", $value: val.$value };
    } else {
      out[key] = stringLeaf(val);
    }
  }
  return out;
}

const primitiveOut = {
  color: primitiveColor,
  space: pxify(primitiveRaw.space),
  radius: pxify(primitiveRaw.radius),
  "border-width": pxify(primitiveRaw["border-width"]),
  font: {
    family: stringLeaf(primitiveRaw.font.family),
    weight: stringifyPlain(primitiveRaw.font.weight),
    size: pxify(primitiveRaw.font.size),
    "line-height": roundedStringify(primitiveRaw.font["line-height"]),
    "letter-spacing-pct": roundedStringify(primitiveRaw.font["letter-spacing-pct"]),
  },
  motion: {
    "duration-ms": roundedStringify(primitiveRaw.motion["duration-ms"]),
    easing: stringLeaf(primitiveRaw.motion.easing),
  },
  shadow: stringLeaf(primitiveRaw.shadow),
};

/* ---------- SEMANTIC: rebuild {ref} from aliasData ----------------------- */

const semGroupsToKeep = ["bg", "text", "border", "action", "state", "link", "radius", "space"];
// decision 2: `charts` deliberately excluded — not in build-tokens.mjs's
// semGroups walk, and its alias targets (support/wild violet/*) no longer
// exist at that path after decision 1's relocation.

const targetToRef = (targetVariableName) => `{${targetVariableName.replace(/\//g, ".")}}`;

function convertSemanticGroup(node, dollarType) {
  const out = {};
  for (const [key, val] of Object.entries(node)) {
    if (isLeaf(val)) {
      const alias = val.$extensions?.["com.figma.aliasData"]?.targetVariableName;
      if (!alias) {
        throw new Error(`Semantic token "${key}" has no com.figma.aliasData.targetVariableName — cannot reconstruct a {ref} without guessing.`);
      }
      out[key] = { $type: dollarType, $value: targetToRef(alias) };
    } else {
      out[key] = convertSemanticGroup(val, dollarType);
    }
  }
  return out;
}

const colorGroups = new Set(["bg", "text", "border", "action", "state", "link"]);

const semanticOut = {};
for (const g of semGroupsToKeep) {
  if (!semanticRaw[g]) continue;
  semanticOut[g] = convertSemanticGroup(semanticRaw[g], colorGroups.has(g) ? "color" : "dimension");
}

/* ---------- WRITE --------------------------------------------------------- */

mkdirSync(resolve(root, outDir), { recursive: true });
writeFileSync(resolve(root, outDir, "primitive.json"), JSON.stringify(primitiveOut, null, 2) + "\n");
writeFileSync(resolve(root, outDir, "semantic.json"), JSON.stringify(semanticOut, null, 2) + "\n");

console.log(`✓ ${outDir}/primitive.json written`);
console.log(`✓ ${outDir}/semantic.json written`);
