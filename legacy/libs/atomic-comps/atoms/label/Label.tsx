import { ReactNode } from "react";
import { ComponentSummary } from "../../Types";

import styles from "./Label.module.css";

export interface LabelProps {
  children: ReactNode;
  htmlFor?: string;
  disabled?: boolean;
  required?: boolean;
  hasError?: boolean;
}

const defaults = {
  disabled: false,
  required: false,
  hasError: false,
};

export const Label = (props: LabelProps) => {
  const { children, disabled, required, hasError } = { ...defaults, ...props };

  const classes = [
    styles.label__root,
    disabled && styles.label__disabled,
    required && styles.label__required,
    hasError && styles.label__hasError,
  ]
    .filter(Boolean)
    .join(" ");

  return <label className={classes}>{children}</label>;
};

export const LabelSummary: ComponentSummary<LabelProps> = {
  children: { type: "any", required: true },
  htmlFor: { type: "string", default: "" },
  disabled: { type: "boolean", default: defaults.disabled.toString() },
  required: { type: "boolean", default: defaults.required.toString() },
  hasError: { type: "boolean", default: defaults.hasError.toString() },
};
