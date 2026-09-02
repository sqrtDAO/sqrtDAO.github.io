/** Dark → light. Lighter = more participation volume. */
const VIOLET_STOPS = [900, 800, 700, 600, 500, 400, 300, 200, 100] as const;

export interface VolumeRange {
  min: number;
  max: number;
}

/** Range of nonzero participation volume across passed epochs — the domain the 9-stop scale is fit to. */
export function getParticipationVolumeRange(volumes: number[]): VolumeRange {
  let min = Infinity;
  let max = -Infinity;
  for (const vol of volumes) {
    min = Math.min(min, vol);
    max = Math.max(max, vol);
  }
  if (min === Infinity) return { min: 0, max: 0 };
  return { min, max };
}

/**
 * Linear (equal value-width, not equal-population) bucketing into the 9-stop
 * violet ramp. t=0 (lowest nonzero vol) -> darkest (900); t=1 (highest) ->
 * lightest (100). All-equal-volume dataset defaults to lightest.
 */
export function getVolumeBucketVar(vol: number, range: VolumeRange): string {
  const t =
    range.max === range.min ? 1 : (vol - range.min) / (range.max - range.min);
  const bucketIndex = Math.min(8, Math.max(0, Math.floor(t * 9)));
  return `var(--color-charts-epochs-${VIOLET_STOPS[bucketIndex]})`;
}
