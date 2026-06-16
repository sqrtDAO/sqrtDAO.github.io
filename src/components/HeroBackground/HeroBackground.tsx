"use client";

import { useEffect, useRef } from "react";

/* Background recipe. Swap PRESET to "dusk" for the moodier rim-off look. */
const PRESETS = {
  aurora: {
    colors: ["#2E7D74", "#FF9A47", "#8A4F5E"],
    flowSpeed: 0.4, warp: 2.4, colorScale: 1.9, shift: 0.0,
    glowPow: 1.6, glowGain: 1.5, rim: 0.45, grain: 0.09, vignette: 0.7,
  },
  dusk: {
    colors: ["#313A63", "#6B4F9E", "#FF9A47"],
    flowSpeed: 0.1, warp: 2.4, colorScale: 4.0, shift: 0.01,
    glowPow: 3.0, glowGain: 0.8, rim: 0.0, grain: 0.09, vignette: 0.92,
  },
};
const PRESET: keyof typeof PRESETS = "aurora";

const VS = `attribute vec2 p;varying vec2 v_uv;void main(){v_uv=vec2(p.x*0.5+0.5,p.y*0.5+0.5);gl_Position=vec4(p,0.0,1.0);}`;
const FS = `precision highp float;
varying vec2 v_uv;
uniform vec2 u_res;uniform vec2 u_mouse;uniform float u_t;
uniform vec3 u_c0,u_c1,u_c2;
uniform float u_warp,u_colorScale,u_shift,u_glowPow,u_glowGain,u_rim,u_grain,u_vignette,u_hoverR;
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);float a=hash(i),b=hash(i+vec2(1,0)),c=hash(i+vec2(0,1)),d=hash(i+vec2(1,1));vec2 u=f*f*(3.0-2.0*f);return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}
float fbm(vec2 p){float s=0.0,a=0.5;for(int i=0;i<5;i++){s+=a*noise(p);p=p*2.0+vec2(1.7,9.2);a*=0.5;}return s;}
vec3 ramp3(float x){x=clamp(x,0.0,1.0);vec3 c=mix(u_c0,u_c1,smoothstep(0.0,0.5,x));c=mix(c,u_c2,smoothstep(0.5,1.0,x));return c;}
void main(){
  float sa=u_res.x/u_res.y;
  vec2 uv=v_uv; uv.x*=sa;
  vec2 p=uv*u_colorScale;
  float t=u_t;
  vec2 q=vec2(fbm(p+vec2(0.0,t*0.6)), fbm(p+vec2(3.1,-t*0.5)));
  vec2 r=vec2(fbm(p+u_warp*q+vec2(1.7,9.2)+t*0.2), fbm(p+u_warp*q+vec2(8.3,2.8)-t*0.15));
  float field=fbm(p+u_warp*r);
  float lum=fbm(p*0.8+u_warp*r*0.6+vec2(4.0));
  float fc=clamp(smoothstep(0.28,0.72,field)+u_shift,0.0,1.0);
  vec2 dd=v_uv; dd.x*=sa; vec2 m=u_mouse; m.x*=sa;
  float hov=smoothstep(u_hoverR,0.0,length(dd-m));
  float glow=pow(clamp(lum,0.0,1.0),u_glowPow);
  vec3 base=vec3(0.013,0.016,0.026);
  vec3 col=base + ramp3(fc)*glow*u_glowGain*(1.0+hov*0.5);
  float edge=exp(-pow((fc-0.32)/0.02,2.0))+exp(-pow((fc-0.68)/0.02,2.0));
  col+= edge*glow*u_rim*mix(vec3(1.0,0.88,0.66), ramp3(fc)+0.3, 0.4);
  float gA=hash(gl_FragCoord.xy+fract(t)*vec2(311.7,191.3));
  float gS=hash(floor(gl_FragCoord.xy*0.5));
  col+=((gA-0.5)*0.85+(gS-0.5)*0.15)*(u_grain+hov*u_grain*1.2);
  vec2 vc=v_uv-0.5; col*=1.0-dot(vc,vc)*u_vignette;
  gl_FragColor=vec4(max(col,0.0),1.0);
}`;

function hex(h: string): [number, number, number] {
  return [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255];
}

export default function HeroBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const gl = cv.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return;
    const P = PRESETS[PRESET];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog); gl.useProgram(prog);
    const vbuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const ploc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(ploc);
    gl.vertexAttribPointer(ploc, 2, gl.FLOAT, false, 0, 0);
    const U: Record<string, WebGLUniformLocation | null> = {};
    ["u_res", "u_mouse", "u_t", "u_c0", "u_c1", "u_c2", "u_warp", "u_colorScale", "u_shift", "u_glowPow", "u_glowGain", "u_rim", "u_grain", "u_vignette", "u_hoverR"].forEach(n => U[n] = gl.getUniformLocation(prog, n));

    gl.uniform3fv(U.u_c0, hex(P.colors[0]));
    gl.uniform3fv(U.u_c1, hex(P.colors[1]));
    gl.uniform3fv(U.u_c2, hex(P.colors[2]));

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      cv.width = w * DPR; cv.height = h * DPR;
      gl.viewport(0, 0, cv.width, cv.height);
    };
    resize();
    window.addEventListener("resize", resize);

    let mx = 0.5, my = 0.5, tx = 0.5, ty = 0.5, lastMove = -9999;
    const move = (cx: number, cy: number) => { tx = cx / window.innerWidth; ty = 1 - cy / window.innerHeight; lastMove = performance.now(); };
    const onPointer = (e: PointerEvent) => move(e.clientX, e.clientY);
    window.addEventListener("pointermove", onPointer);

    const start = performance.now();
    let raf = 0, running = true;
    const frame = (now: number) => {
      if (!running) return;
      const t = reduce ? 0 : (now - start) / 1000 * P.flowSpeed;
      if (now - lastMove > 1200 && !reduce) { const a = (now - start) / 1000; tx = 0.5 + 0.34 * Math.sin(a * 0.11); ty = 0.5 + 0.24 * Math.cos(a * 0.15); }
      mx += (tx - mx) * 0.05; my += (ty - my) * 0.05;
      gl.uniform2f(U.u_res, cv.width, cv.height);
      gl.uniform2f(U.u_mouse, mx, my);
      gl.uniform1f(U.u_t, t);
      gl.uniform1f(U.u_warp, P.warp); gl.uniform1f(U.u_colorScale, P.colorScale); gl.uniform1f(U.u_shift, P.shift);
      gl.uniform1f(U.u_glowPow, P.glowPow); gl.uniform1f(U.u_glowGain, P.glowGain); gl.uniform1f(U.u_rim, P.rim);
      gl.uniform1f(U.u_grain, P.grain); gl.uniform1f(U.u_vignette, P.vignette); gl.uniform1f(U.u_hoverR, 0.34);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onVis = () => {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(frame);
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", display: "block", zIndex: 0, pointerEvents: "none" }} />;
}
