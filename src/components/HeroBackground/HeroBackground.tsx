"use client";

import { useEffect, useRef } from "react";

const VS = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";

const FS = `precision mediump float;
uniform vec2 u_res;uniform float u_time;uniform vec2 u_mouse;
float h(vec2 q){return fract(sin(dot(q,vec2(127.1,311.7)))*43758.5453);}
float nz(vec2 q){vec2 i=floor(q),f=fract(q);float a=h(i),b=h(i+vec2(1,0)),c=h(i+vec2(0,1)),d=h(i+vec2(1,1));
  vec2 u=f*f*(3.-2.*f);return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;}
float fbm(vec2 q){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*nz(q);q*=2.02;a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/u_res;float asp=u_res.x/u_res.y;
  vec2 p=(uv-0.5);p.x*=asp;
  float t=u_time*0.03;
  vec2 mUV=vec2(u_mouse.x,1.0-u_mouse.y);
  vec2 mp=(mUV-0.5);mp.x*=asp;
  vec2 q=vec2(fbm(p*1.1+t),fbm(p*1.1+vec2(3.0,1.0)-t));
  float f=fbm(p*1.1+1.2*q+0.10*(mUV-0.5));
  vec3 cVoid=vec3(0.045,0.054,0.075);
  vec3 cDeep=vec3(0.095,0.116,0.197);
  vec3 cInfra=vec3(0.202,0.238,0.407);
  vec3 col=mix(cVoid,cDeep,smoothstep(0.25,0.65,f));
  col=mix(col,cInfra,smoothstep(0.62,0.94,f)*0.65);
  float md=length(p-mp);
  float shadow=smoothstep(0.46,0.0,md);
  vec3 navy=vec3(0.016,0.030,0.082);
  col=mix(col,navy,shadow*0.6);
  col*=1.0-shadow*0.22;
  col+=(h(uv+fract(u_time))-0.5)*0.018;
  float vig=smoothstep(1.30,0.40,length(uv-0.5));
  col*=0.55+0.45*vig;
  gl_FragColor=vec4(col,1.0);
}`;

const COL_POSITIONS = [0, 152, 304, 456, 608, 760, 912, 1064, 1216, 1368, 1520, 1672];

export default function HeroBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const gl = cv.getContext("webgl") || cv.getContext("experimental-webgl") as WebGLRenderingContext | null;
    if (!gl) {
      cv.style.background = "radial-gradient(80% 80% at 50% 45%,#16203a,#0B0D12)";
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let mouse = [0.5, 0.5];
    let tm = [0.5, 0.5];

    const onMouseMove = (e: MouseEvent) => {
      mouse = [e.clientX / window.innerWidth, e.clientY / window.innerHeight];
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouse = [e.touches[0].clientX / window.innerWidth, e.touches[0].clientY / window.innerHeight];
      }
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    const sh = (type: number, src: string) => {
      const s = (gl as WebGLRenderingContext).createShader(type)!;
      (gl as WebGLRenderingContext).shaderSource(s, src);
      (gl as WebGLRenderingContext).compileShader(s);
      return s;
    };
    const g = gl as WebGLRenderingContext;
    const prog = g.createProgram()!;
    g.attachShader(prog, sh(g.VERTEX_SHADER, VS));
    g.attachShader(prog, sh(g.FRAGMENT_SHADER, FS));
    g.linkProgram(prog);
    g.useProgram(prog);

    const buf = g.createBuffer();
    g.bindBuffer(g.ARRAY_BUFFER, buf);
    g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), g.STATIC_DRAW);
    const loc = g.getAttribLocation(prog, "p");
    g.enableVertexAttribArray(loc);
    g.vertexAttribPointer(loc, 2, g.FLOAT, false, 0, 0);

    const uR = g.getUniformLocation(prog, "u_res");
    const uT = g.getUniformLocation(prog, "u_time");
    const uM = g.getUniformLocation(prog, "u_mouse");

    const resize = () => {
      const d = Math.min(window.devicePixelRatio || 1, 1.5);
      cv.width = window.innerWidth * d;
      cv.height = window.innerHeight * d;
      g.viewport(0, 0, cv.width, cv.height);
    };
    window.addEventListener("resize", resize);
    resize();

    const start = Date.now();
    let raf = 0;

    const draw = () => {
      tm[0] += (mouse[0] - tm[0]) * 0.06;
      tm[1] += (mouse[1] - tm[1]) * 0.06;
      g.uniform2f(uR, cv.width, cv.height);
      g.uniform1f(uT, reduce ? 6.0 : (Date.now() - start) / 1000);
      g.uniform2f(uM, tm[0], tm[1]);
      g.drawArrays(g.TRIANGLES, 0, 6);
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  return (
    <>
      <canvas
        ref={ref}
        aria-hidden="true"
        style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", display: "block", zIndex: 0, pointerEvents: "none" }}
      />
      <div
        className="veil"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          background: "radial-gradient(120% 100% at 50% 45%, transparent 55%, rgba(11,13,18,.55) 100%)",
        }}
      />
      <div
        className="cols"
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 1672,
          height: "100vh",
          zIndex: 3,
          pointerEvents: "none",
          overflow: "visible",
          display: "none",
        }}
      >
        <svg width={1672} height="100%" preserveAspectRatio="none" style={{ display: "block", width: 1672, overflow: "visible" }}>
          {COL_POSITIONS.map((x) => (
            <line
              key={x}
              x1={x}
              y1={0}
              x2={x}
              y2="100%"
              stroke="#FFFFFF"
              strokeOpacity={0.2}
              strokeWidth={0.25}
            />
          ))}
        </svg>
      </div>
    </>
  );
}
