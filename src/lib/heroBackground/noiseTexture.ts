/**
 * Bakes the fbm() lattice noise into a static tileable texture at init.
 *
 * The original demo computed `hash(vec2)=fract(sin(dot(q,vec2(127.1,311.7)))*43758.5453)`
 * per fragment, per octave, ~144 times/pixel/frame. Every fbm() call's time-dependence is an
 * additive shift on the *coordinate* fed into hash/nz, never a reseed of hash() itself — so a
 * static texture sampled at those same time-shifting coordinates reproduces the original
 * exactly. This bakes the literal same hash lattice values (same formula, evaluated once at
 * integer coordinates) instead of computing sin() per fragment; the shader samples it with
 * GL_LINEAR (bilinear) instead of the original's manual quintic-smoothed interpolation — a
 * subtle difference masked by the heavy domain warp downstream.
 *
 * 256x256 keeps the bake cheap and gives GL_REPEAT a large-enough tile that domain warping
 * (fw/fw2 feedback distorting sample coordinates) hides periodic repetition in practice.
 */
export const NOISE_SIZE = 256;

function hash2(x: number, y: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

export function createNoiseTexture(gl: WebGLRenderingContext): WebGLTexture {
  const data = new Uint8Array(NOISE_SIZE * NOISE_SIZE);
  for (let y = 0; y < NOISE_SIZE; y++) {
    for (let x = 0; x < NOISE_SIZE; x++) {
      data[y * NOISE_SIZE + x] = Math.floor(hash2(x, y) * 255);
    }
  }

  const texture = gl.createTexture();
  if (!texture) throw new Error("Failed to create noise texture");
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, NOISE_SIZE, NOISE_SIZE, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, data);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  return texture;
}
