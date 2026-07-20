"use client";

import "./Stepper.css";

type StepState = "active" | "not-active" | "passed" | "hovered";

export interface StepperItemProps {
  stepName: string;
  state?: StepState;
}

export function StepperItem({ stepName, state = "not-active" }: StepperItemProps) {
  return (
    <div className={`stepper-item stepper-item--${state}`}>
      {stepName}
    </div>
  );
}

export interface StepperProps {
  steps: string[];
  activeIndex?: number;
  className?: string;
}

export default function Stepper({ steps, activeIndex = 0, className }: StepperProps) {
  return (
    <nav className={`stepper${className ? ` ${className}` : ""}`} aria-label="Progress">
      {steps.map((name, i) => {
        const state: StepState =
          i < activeIndex ? "passed" : i === activeIndex ? "active" : "not-active";
        return <StepperItem key={name} stepName={name} state={state} />;
      })}
    </nav>
  );
}
