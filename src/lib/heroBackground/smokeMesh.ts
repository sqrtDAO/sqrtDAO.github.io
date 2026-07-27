import { CLOUD_FRAGMENT_SHADER, COMPOSITE_FRAGMENT_SHADER, VERTEX_SHADER } from "./shaders";
import { createNoiseTexture } from "./noiseTexture";

export interface SmokeMeshOptions {
  colors: [string, string, string];
  intensity: number;
  grain: number;
  mesh: number;
  speed: number;
  hover: number;
  /** Max device-pixel-ratio (perf ceiling). */
  quality: number;
  /** Pass-1 (cloud/fbm) framebuffer resolution as a factor of canvas size. */
  scale: number;
}

export interface SmokeMeshBackground {
  setColors(colors: string[]): void;
  setIntensity(n: number): void;
  setOptions(opts: Partial<SmokeMeshOptions>): void;
  destroy(): void;
}

const DEFAULTS: SmokeMeshOptions = {
  colors: ["#6B4F9E", "#C4892A", "#E8E2F0"],
  intensity: 0.85,
  grain: 0,
  mesh: 1.0,
  speed: 0.7,
  hover: 1.0,
  quality: 1.5,
  scale: 0.5,
};

const FRAME_INTERVAL_MS = 1000 / 30;
const REDUCED_TIME = 5.0;
// Time constants derived from the original's fixed per-tick lerp factors (0.07 hover / 0.045
// mouse) at their implicit 60fps baseline, converted to dt-scaled exponential decay so smoothing
// speed stays constant in wall-clock time regardless of the render cadence.
const HOVER_TAU_MS = 230;
const MOUSE_TAU_MS = 362;

function hex2rgb(hex: string): [number, number, number] {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  return [parseInt(h.slice(0, 2), 16) / 255, parseInt(h.slice(2, 4), 16) / 255, parseInt(h.slice(4, 6), 16) / 255];
}

function compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Failed to create shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile error: ${info}`);
  }
  return shader;
}

function linkProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string): WebGLProgram {
  const program = gl.createProgram();
  if (!program) throw new Error("Failed to create program");
  gl.attachShader(program, compileShader(gl, gl.VERTEX_SHADER, vsSource));
  gl.attachShader(program, compileShader(gl, gl.FRAGMENT_SHADER, fsSource));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Program link error: ${info}`);
  }
  return program;
}

function createRenderTargetTexture(gl: WebGLRenderingContext, width: number, height: number): WebGLTexture {
  const texture = gl.createTexture();
  if (!texture) throw new Error("Failed to create render target texture");
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  return texture;
}

export function createSmokeMeshBackground(
  canvas: HTMLCanvasElement,
  opts: Partial<SmokeMeshOptions> = {},
): SmokeMeshBackground {
  const o: SmokeMeshOptions = { ...DEFAULTS, ...opts, colors: (opts.colors as [string, string, string]) ?? DEFAULTS.colors };
  // No auto-throttle on dprCap: see DECISIONS.md "Adaptive DPR throttle removed" before
  // re-adding one -- the previous version misfired on fast hardware.
  let dprCap = o.quality;
  let scale = o.scale;
  let [colA, colB, colC] = [hex2rgb(o.colors[0]), hex2rgb(o.colors[1] ?? o.colors[0]), hex2rgb(o.colors[2] ?? o.colors[1] ?? o.colors[0])];

  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

  const ctxAttribs: WebGLContextAttributes = { alpha: true, premultipliedAlpha: false, antialias: false, depth: false };
  let gl = (canvas.getContext("webgl", ctxAttribs) as WebGLRenderingContext | null) ?? undefined;
  if (!gl) {
    return { setColors: () => {}, setIntensity: () => {}, setOptions: () => {}, destroy: () => {} };
  }

  let cloudProgram!: WebGLProgram;
  let compositeProgram!: WebGLProgram;
  let quadBuffer!: WebGLBuffer;
  let noiseTexture!: WebGLTexture;
  let cloudTexture!: WebGLTexture;
  let cloudFramebuffer!: WebGLFramebuffer;
  let cloudFboW = 0;
  let cloudFboH = 0;

  let uCloud: Record<string, WebGLUniformLocation | null> = {};
  let uComposite: Record<string, WebGLUniformLocation | null> = {};
  let attribCloud = 0;
  let attribComposite = 0;

  function build() {
    const g = gl as WebGLRenderingContext;
    g.getExtension("OES_standard_derivatives");

    cloudProgram = linkProgram(g, VERTEX_SHADER, CLOUD_FRAGMENT_SHADER);
    compositeProgram = linkProgram(g, VERTEX_SHADER, COMPOSITE_FRAGMENT_SHADER);

    quadBuffer = g.createBuffer() ?? (() => { throw new Error("Failed to create quad buffer"); })();
    g.bindBuffer(g.ARRAY_BUFFER, quadBuffer);
    g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), g.STATIC_DRAW);

    attribCloud = g.getAttribLocation(cloudProgram, "p");
    attribComposite = g.getAttribLocation(compositeProgram, "p");

    uCloud = {
      u_res: g.getUniformLocation(cloudProgram, "u_res"),
      u_time: g.getUniformLocation(cloudProgram, "u_time"),
      u_mouse: g.getUniformLocation(cloudProgram, "u_mouse"),
      u_speed: g.getUniformLocation(cloudProgram, "u_speed"),
      u_hover: g.getUniformLocation(cloudProgram, "u_hover"),
      u_noise: g.getUniformLocation(cloudProgram, "u_noise"),
    };
    uComposite = {
      u_res: g.getUniformLocation(compositeProgram, "u_res"),
      u_time: g.getUniformLocation(compositeProgram, "u_time"),
      u_mouse: g.getUniformLocation(compositeProgram, "u_mouse"),
      u_intensity: g.getUniformLocation(compositeProgram, "u_intensity"),
      u_grain: g.getUniformLocation(compositeProgram, "u_grain"),
      u_mesh: g.getUniformLocation(compositeProgram, "u_mesh"),
      u_speed: g.getUniformLocation(compositeProgram, "u_speed"),
      u_hover: g.getUniformLocation(compositeProgram, "u_hover"),
      u_colA: g.getUniformLocation(compositeProgram, "u_colA"),
      u_colB: g.getUniformLocation(compositeProgram, "u_colB"),
      u_colC: g.getUniformLocation(compositeProgram, "u_colC"),
      u_cloudTex: g.getUniformLocation(compositeProgram, "u_cloudTex"),
      u_noise: g.getUniformLocation(compositeProgram, "u_noise"),
    };

    noiseTexture = createNoiseTexture(g);
    cloudTexture = createRenderTargetTexture(g, 1, 1);
    cloudFramebuffer = g.createFramebuffer() ?? (() => { throw new Error("Failed to create framebuffer"); })();
    g.bindFramebuffer(g.FRAMEBUFFER, cloudFramebuffer);
    g.framebufferTexture2D(g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, cloudTexture, 0);
    g.bindFramebuffer(g.FRAMEBUFFER, null);
    cloudFboW = 0;
    cloudFboH = 0;
  }
  build();

  // ---- sizing ----
  function resizeCloudFbo() {
    const g = gl as WebGLRenderingContext;
    const w = Math.max(1, Math.round(canvas.width * scale));
    const h = Math.max(1, Math.round(canvas.height * scale));
    if (w === cloudFboW && h === cloudFboH) return;
    cloudFboW = w;
    cloudFboH = h;
    g.bindTexture(g.TEXTURE_2D, cloudTexture);
    g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, w, h, 0, g.RGBA, g.UNSIGNED_BYTE, null);
  }
  function resize() {
    const g = gl as WebGLRenderingContext;
    const w = Math.max(1, canvas.clientWidth || window.innerWidth);
    const h = Math.max(1, canvas.clientHeight || window.innerHeight);
    const d = Math.min(window.devicePixelRatio || 1, dprCap);
    canvas.width = Math.round(w * d);
    canvas.height = Math.round(h * d);
    g.viewport(0, 0, canvas.width, canvas.height);
    resizeCloudFbo();
  }
  let resizeObserver: ResizeObserver | null = null;
  if (window.ResizeObserver) {
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
  }
  window.addEventListener("resize", resize);
  resize();

  // ---- pointer input ----
  let mouseTarget: [number, number] = [0.5, 0.5];
  let mouseSmoothed: [number, number] = [0.5, 0.5];
  let hoverTarget = 0;
  let hoverSmoothed = 0;

  function onPointerMove(e: MouseEvent | TouchEvent) {
    let x: number, y: number;
    if ("touches" in e && e.touches[0]) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    } else {
      x = (e as MouseEvent).clientX;
      y = (e as MouseEvent).clientY;
    }
    const r = canvas.getBoundingClientRect();
    mouseTarget = [(x - r.left) / Math.max(1, r.width), 1 - (y - r.top) / Math.max(1, r.height)];
    hoverTarget = 1;
  }
  function onLeave() {
    hoverTarget = 0;
  }
  window.addEventListener("mousemove", onPointerMove);
  window.addEventListener("touchmove", onPointerMove, { passive: true });
  document.addEventListener("mouseleave", onLeave);
  window.addEventListener("blur", onLeave);
  window.addEventListener("touchend", onLeave, { passive: true });

  // ---- context loss recovery ----
  let running = true;
  let raf = 0;
  function onContextLost(e: Event) {
    e.preventDefault();
    running = false;
    cancelAnimationFrame(raf);
  }
  function onContextRestored() {
    gl = (canvas.getContext("webgl", ctxAttribs) as WebGLRenderingContext | null) ?? undefined;
    if (!gl) return;
    build();
    resize();
    running = true;
    lastTick = performance.now();
    if (reduce) {
      draw(REDUCED_TIME);
    } else {
      raf = requestAnimationFrame(tick);
    }
  }
  canvas.addEventListener("webglcontextlost", onContextLost, false);
  canvas.addEventListener("webglcontextrestored", onContextRestored, false);

  // ---- render loop ----
  const start = performance.now();
  let lastTick = performance.now();
  let drawAccum = 0;

  function drawPass(
    program: WebGLProgram,
    attrib: number,
    framebuffer: WebGLFramebuffer | null,
    width: number,
    height: number,
  ) {
    const g = gl as WebGLRenderingContext;
    g.bindFramebuffer(g.FRAMEBUFFER, framebuffer);
    g.viewport(0, 0, width, height);
    g.useProgram(program);
    g.bindBuffer(g.ARRAY_BUFFER, quadBuffer);
    g.enableVertexAttribArray(attrib);
    g.vertexAttribPointer(attrib, 2, g.FLOAT, false, 0, 0);
    g.drawArrays(g.TRIANGLES, 0, 6);
  }

  function draw(timeSeconds: number) {
    const g = gl as WebGLRenderingContext;
    const hover = o.hover * hoverSmoothed;

    g.useProgram(cloudProgram);
    g.uniform2f(uCloud.u_res, cloudFboW, cloudFboH);
    g.uniform1f(uCloud.u_time, timeSeconds);
    g.uniform2f(uCloud.u_mouse, mouseSmoothed[0], mouseSmoothed[1]);
    g.uniform1f(uCloud.u_speed, o.speed);
    g.uniform1f(uCloud.u_hover, hover);
    g.activeTexture(g.TEXTURE0);
    g.bindTexture(g.TEXTURE_2D, noiseTexture);
    g.uniform1i(uCloud.u_noise, 0);
    drawPass(cloudProgram, attribCloud, cloudFramebuffer, cloudFboW, cloudFboH);

    g.useProgram(compositeProgram);
    g.uniform2f(uComposite.u_res, canvas.width, canvas.height);
    g.uniform1f(uComposite.u_time, timeSeconds);
    g.uniform2f(uComposite.u_mouse, mouseSmoothed[0], mouseSmoothed[1]);
    g.uniform1f(uComposite.u_intensity, o.intensity);
    g.uniform1f(uComposite.u_grain, o.grain);
    g.uniform1f(uComposite.u_mesh, o.mesh);
    g.uniform1f(uComposite.u_speed, o.speed);
    g.uniform1f(uComposite.u_hover, hover);
    g.uniform3f(uComposite.u_colA, colA[0], colA[1], colA[2]);
    g.uniform3f(uComposite.u_colB, colB[0], colB[1], colB[2]);
    g.uniform3f(uComposite.u_colC, colC[0], colC[1], colC[2]);
    g.activeTexture(g.TEXTURE0);
    g.bindTexture(g.TEXTURE_2D, cloudTexture);
    g.uniform1i(uComposite.u_cloudTex, 0);
    g.activeTexture(g.TEXTURE1);
    g.bindTexture(g.TEXTURE_2D, noiseTexture);
    g.uniform1i(uComposite.u_noise, 1);
    // No gl.clear() here: blending is never enabled, so the fullscreen composite quad always
    // fully overwrites every pixel. (A clear was tried here once — it clears whatever framebuffer
    // is currently bound, which right after the cloud pass is still cloudFramebuffer, wiping the
    // texture pass 2 is about to sample. Don't reintroduce it without rebinding first.)
    drawPass(compositeProgram, attribComposite, null, canvas.width, canvas.height);
  }

  function tick(now: number) {
    if (!running) return;
    const dt = now - lastTick;
    lastTick = now;

    hoverSmoothed += (hoverTarget - hoverSmoothed) * (1 - Math.exp(-dt / HOVER_TAU_MS));
    mouseSmoothed = [
      mouseSmoothed[0] + (mouseTarget[0] - mouseSmoothed[0]) * (1 - Math.exp(-dt / MOUSE_TAU_MS)),
      mouseSmoothed[1] + (mouseTarget[1] - mouseSmoothed[1]) * (1 - Math.exp(-dt / MOUSE_TAU_MS)),
    ];

    drawAccum += dt;
    if (drawAccum >= FRAME_INTERVAL_MS) {
      drawAccum %= FRAME_INTERVAL_MS;
      draw((now - start) / 1000);
    }
    raf = requestAnimationFrame(tick);
  }

  function onVisibility() {
    running = !document.hidden;
    if (running && !reduce) {
      lastTick = performance.now();
      raf = requestAnimationFrame(tick);
    }
  }
  document.addEventListener("visibilitychange", onVisibility);

  if (reduce) {
    draw(REDUCED_TIME);
  } else {
    raf = requestAnimationFrame(tick);
  }

  return {
    setColors(colors: string[]) {
      colA = hex2rgb(colors[0]);
      colB = hex2rgb(colors[1] ?? colors[0]);
      colC = hex2rgb(colors[2] ?? colors[1] ?? colors[0]);
      if (reduce) draw(REDUCED_TIME);
    },
    setIntensity(n: number) {
      o.intensity = n;
      if (reduce) draw(REDUCED_TIME);
    },
    setOptions(next: Partial<SmokeMeshOptions>) {
      if (next.quality != null) {
        dprCap = next.quality;
        resize();
      }
      if (next.scale != null) {
        scale = next.scale;
        resizeCloudFbo();
      }
      if (next.intensity != null) o.intensity = next.intensity;
      if (next.grain != null) o.grain = next.grain;
      if (next.mesh != null) o.mesh = next.mesh;
      if (next.speed != null) o.speed = next.speed;
      if (next.hover != null) o.hover = next.hover;
      if (next.colors) this.setColors(next.colors);
      if (reduce) draw(REDUCED_TIME);
    },
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onLeave);
      window.removeEventListener("blur", onLeave);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      const g = gl as WebGLRenderingContext | undefined;
      const ext = g?.getExtension("WEBGL_lose_context");
      try {
        ext?.loseContext();
      } catch {
        // context already gone
      }
    },
  };
}
