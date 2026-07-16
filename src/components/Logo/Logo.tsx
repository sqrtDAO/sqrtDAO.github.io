/* sqrtDAO — Logo (Figma component set 1327:478)
   variant : complete (mark + wordmark, 109.77×48) | sign (mark only, 51.72×40)
   mono    : false = colored (amber accent squares) | true = monochrome
   dark    : true = for dark backgrounds (light logo) | false = for light backgrounds (dark logo)
   Assets are static SVGs in /public/logo — exported once from Figma, not hotlinked
   (Figma's asset URLs expire after 7 days). */

export type LogoVariant = "complete" | "sign";

export interface LogoProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> {
  variant?: LogoVariant;
  mono?: boolean;
  dark?: boolean;
}

const SIZES: Record<LogoVariant, { width: number; height: number }> = {
  complete: { width: 110, height: 48 },
  sign: { width: 52, height: 40 },
};

export default function Logo({
  variant = "complete",
  mono = false,
  dark = true,
  width,
  height,
  ...rest
}: LogoProps) {
  const colorSlug = mono ? "mono" : "colored";
  const bgSlug = dark ? "onDark" : "onLight";
  const src = `/logo/${variant}-${colorSlug}-${bgSlug}.svg`;

  // Only apply both intrinsic defaults when the caller sets neither — if either
  // is overridden, leave the other unset so the browser derives it from the
  // SVG's natural aspect ratio instead of stretching the mark.
  const hasCustomSize = width !== undefined || height !== undefined;
  const defaults = SIZES[variant];

  return (
    <img
      src={src}
      alt="sqrtDAO"
      width={width ?? (hasCustomSize ? undefined : defaults.width)}
      height={height ?? (hasCustomSize ? undefined : defaults.height)}
      {...rest}
    />
  );
}
