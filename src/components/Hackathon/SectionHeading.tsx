import type { ReactNode } from "react";

type Props = {
  text: string;
  /** Optional styled continuation, e.g. "Prizes" + "worth shipping for". */
  tail?: string;
  tailClassName?: string;
  id?: string;
  className?: string;
  wrapClassName?: string;
  /** A Figma black band/shape drawn behind the heading. */
  backing?: ReactNode;
};

const SectionHeading = ({ text, tail, tailClassName = "", id, className = "", wrapClassName = "", backing }: Props) => (
  <div className={`relative ${wrapClassName}`}>
    {backing}
    <h2 id={id} className={`relative ${className}`}>
      {text}
      {tail && <span className={tailClassName}> {tail}</span>}
    </h2>
  </div>
);

export default SectionHeading;
