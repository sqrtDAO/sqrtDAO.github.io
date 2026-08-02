/**
 * Calculates sqrtPriceX96 from a price ratio.
 * Equivalent to: floor(sqrt(amount1 / amount0) * 2^96)
 *
 * @param amount1 - Raw amount of token1 (in its smallest unit)
 * @param amount0 - Raw amount of token0 (in its smallest unit)
 * @returns The sqrtPriceX96 as a bigint (uint160 compatible)
 */
export function quickSqrtPriceX96(amount1: bigint, amount0: bigint): bigint {
  if (amount0 <= 0n) {
    throw new Error("amount0 must be positive");
  }

  // Multiply numerator by 2^192, divide by denominator, then integer square root.
  // This is mathematically equivalent to sqrt(amount1 / amount0) * 2^96.
  const numerator = amount1 << 192n;
  const ratioX192 = numerator / amount0;

  return sqrt(ratioX192);
}

/**
 * Integer square root for bigint using Newton's method.
 * Returns the largest integer x such that x^2 <= n.
 */
function sqrt(n: bigint): bigint {
  if (n < 0n) {
    throw new Error("Square root of negative number is not supported");
  }
  if (n < 2n) {
    return n;
  }

  // Initial guess: 2 ^ ((bitLength(n) + 1) / 2)
  let x = 2n ** BigInt((bitLength(n) + 1n) / 2n);
  let y = (x + n / x) >> 1n;

  while (y < x) {
    x = y;
    y = (x + n / x) >> 1n;
  }
  return x;
}

/**
 * Returns the number of bits needed to represent the absolute value of n.
 */
function bitLength(n: bigint): bigint {
  return BigInt(n.toString(2).length);
}
