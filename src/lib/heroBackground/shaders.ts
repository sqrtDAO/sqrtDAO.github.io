import { NOISE_SIZE } from "./noiseTexture";

/**
 * Two-pass port of sqrtdao-smoke-mesh-bg.html, optimized:
 *   - Pass 1 (offscreen FBO, rendered at `scale` resolution): every fbm()-heavy term
 *     (cloud density, cz, fw) — the low-frequency content that tolerates a bilinear upscale.
 *   - Pass 2 (native resolution): reconstructs color from pass 1's texture, then computes the
 *     fwidth()-based mesh grid at full derivative resolution so line AA stays crisp, plus grain
 *     (cheap, left as live per-pixel hash — only 2 sin() calls, not worth baking/blurring).
 *
 * fbm() is 3 octaves (was 4 — the dropped octave was both lowest-amplitude and highest-frequency,
 * a band that would alias away under the half-res pass anyway) and samples the baked noise
 * texture instead of computing sin()-based hash per fragment.
 */

export const VERTEX_SHADER = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const NOISE_GLSL = `
uniform sampler2D u_noise;
float nz(vec2 q){ return texture2D(u_noise, q * (1.0 / ${NOISE_SIZE.toFixed(1)})).r; }
float fbm(vec2 q){
  float v=0.,a=.5;
  for(int i=0;i<3;i++){ v+=a*nz(q); q=q*2.02+vec2(1.3,7.1); a*=.5; }
  return v;
}`;

// Recomputes pc/dist (cheap ALU, no fbm) identically in both passes so pass 2 doesn't need to
// carry it through the pass-1 texture.
const POINTER_WARP_GLSL = `
  vec2 uv=gl_FragCoord.xy/u_res;float asp=u_res.x/u_res.y;
  vec2 p=(uv-0.5);p.x*=asp;
  vec2 mp=(u_mouse-0.5);mp.x*=asp;
  vec2 dm=p-mp;float dist=length(dm);
  vec2 wander=vec2(sin(u_time*0.035*u_speed)*0.04, cos(u_time*0.030*u_speed)*0.03);
  vec2 mShift=mp*0.04*u_hover;
  vec2 hand=dm*exp(-dist*dist*5.0)*0.55*u_hover;
  vec2 pc=p+wander-mShift+hand;
`;

/** Pass 1: cloud density (R), cz (G), fw.xy (BA) — packed into one RGBA8 target. */
export const CLOUD_FRAGMENT_SHADER = `precision highp float;
uniform vec2 u_res;uniform float u_time;uniform vec2 u_mouse;
uniform float u_speed,u_hover;
${NOISE_GLSL}
void main(){
${POINTER_WARP_GLSL}
  float tt=u_time*0.07*u_speed;
  vec2 fw=vec2(fbm(pc*1.0+tt), fbm(pc*1.0+vec2(4.0,2.0)-tt));
  vec2 fw2=vec2(fbm(pc*2.0+1.8*fw+tt*0.7), fbm(pc*2.0+1.8*fw+vec2(6.0,1.0)-tt*0.5));
  vec2 ps=pc + 0.45*(fw-0.5) + 0.22*(fw2-0.5);

  vec2 ext=vec2(0.438*asp, 0.324);
  float rr=length(ps/ext);
  float lobe=0.40*fbm(ps*1.1+tt) + 0.22*fbm(ps*2.4-tt*0.6);
  float core=smoothstep(1.30,0.24, rr - lobe);
  float wisp=fbm(ps*1.9+tt*0.8);
  float cloud=clamp(core*(0.50+0.60*wisp), 0.0, 1.0);

  float cz=smoothstep(0.28,0.72, fbm(ps*0.6+fw+vec2(7.0,3.0)));

  gl_FragColor=vec4(cloud, cz, fw.x, fw.y);
}`;

/**
 * Pass 2: native-res composite. Samples pass 1's texture for cloud/cz/fw, recomputes the
 * mesh-tear noise `tn` as one live 3-octave fbm (cheaper than a second FBO pass to carry one
 * scalar), and approximates the atmospheric-dust radius `rr` from `pc+fw` only (omitting the
 * fw2 contribution to `ps`, since fw2 isn't packed in the pass-1 texture and has no other use —
 * atmDust is a low-frequency, low-opacity peripheral glow where this is visually safe).
 */
export const COMPOSITE_FRAGMENT_SHADER = `#extension GL_OES_standard_derivatives : enable
precision highp float;
uniform vec2 u_res;uniform float u_time;uniform vec2 u_mouse;
uniform float u_intensity,u_grain,u_mesh,u_speed,u_hover;
uniform vec3 u_colA,u_colB,u_colC;
uniform sampler2D u_cloudTex;
${NOISE_GLSL}
float hash(vec2 q){return fract(sin(dot(q,vec2(127.1,311.7)))*43758.5453);}
void main(){
${POINTER_WARP_GLSL}
  float prox=exp(-dist*dist*3.0);

  vec4 cloudSample=texture2D(u_cloudTex, uv);
  float cloud=cloudSample.r;
  float cz=cloudSample.g;
  vec2 fw=cloudSample.ba;

  vec3 base=mix(u_colA,u_colB,cz);
  base=mix(u_colC, base, smoothstep(0.0,0.6,cloud));

  vec2 gwarp=0.40*(fw-0.5)+vec2(0.0,cloud*0.08);
  vec2 gco=(pc+gwarp)*26.0;
  vec2 gdv=fwidth(gco);
  vec2 grid=abs(fract(gco-0.5)-0.5)/max(gdv,vec2(1e-4));
  float ln=clamp(1.0-min(min(grid.x,grid.y),1.0),0.0,1.0);
  float tn=fbm(pc*7.0+u_time*0.35);
  float tear=prox*u_hover*smoothstep(0.40,0.70,tn);
  ln*=clamp(1.0-tear,0.0,1.0);
  float mesh=ln*smoothstep(0.05,0.42,cloud)*u_mesh;

  float grain=hash(uv*u_res*0.8+floor(u_time*8.0)*53.0);
  vec2 psApprox=pc + 0.45*(fw-0.5);
  vec2 ext=vec2(0.438*asp, 0.324);
  float rr=length(psApprox/ext);
  float atm=smoothstep(1.85,0.55,rr);
  float g2=hash(uv*u_res*1.25+floor(u_time*6.0)*97.0);
  float atmDust=atm*smoothstep(0.82,1.0,g2)*(0.10+u_grain*0.12);

  vec3 netCol=vec3(0.50,0.46,0.36);
  vec3 col=base + (grain-0.5)*0.05*(0.45+u_grain);
  col=mix(col, netCol, mesh*0.5);
  col=mix(col, base*0.7, atmDust*0.6);
  col*=u_intensity*0.6;

  float edgeBand=smoothstep(0.0,0.4,cloud)*(1.0-smoothstep(0.5,0.95,cloud));
  float a=cloud - edgeBand*(grain-0.5)*(0.45+u_grain*1.1);
  a=clamp(a,0.0,1.0);
  float alpha=clamp(a + mesh*0.5 + atmDust*(1.0-a), 0.0, 1.0);
  gl_FragColor=vec4(col,alpha);
}`;
