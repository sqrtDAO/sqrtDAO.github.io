export const quickSqrtPriceX96 = (
  amountA: number,
  amountB: number,
  decimalsA: number,
  decimalsB: number,
): number => {
  const adjustedA = amountA * Math.pow(10, decimalsA);
  const adjustedB = amountB * Math.pow(10, decimalsB);

  const price = adjustedB / adjustedA;
  const sqrtPrice = Math.sqrt(price);
  const sqrtPriceX96 = sqrtPrice * Math.pow(2, 96);

  return Math.floor(sqrtPriceX96);
};
