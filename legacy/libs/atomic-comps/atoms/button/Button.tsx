import { ButtonSize, ButtonStyle, ButtonVariant } from "./Button.types";

import styles from "./Button.module.css";
import { ComponentSummary } from "../../Types";

export interface ButtonProps {
  children: React.ReactNode;
  style?: keyof typeof ButtonStyle;
  size?: keyof typeof ButtonSize;
  variant?: keyof typeof ButtonVariant;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

const defaults = {
  style: "outlined",
  size: "regular",
  variant: "primary",
  disabled: false,
  onClick: () => {},
};

export const Button = (props: ButtonProps) => {
  const { children, style, size, variant, disabled, onClick } = { ...defaults, ...props };

  const classes = [
    styles.button__root,
    styles[`button__${style}`],
    styles[`button__${size}`],
    styles[`button__${variant}`],
    disabled && styles.button__disabled,
  ]
    .filter(Boolean)
    .join(" ");

  const renderProps = {
    disabled,
    onClick,
  };

  return (
    <button className={classes} {...renderProps}>
      {children}
    </button>
  );
};

export const ButtonSummary: ComponentSummary<ButtonProps> = {
  children: { type: "any", required: true },
  style: { type: Object.keys(ButtonStyle).join(" | "), default: defaults.style },
  size: { type: Object.keys(ButtonSize).join(" | "), default: defaults.size },
  variant: { type: Object.keys(ButtonVariant).join(" | "), default: defaults.variant },
  disabled: { type: "boolean", default: defaults.disabled.toString() },
  onClick: { type: "(event: Event) => void", default: defaults.onClick.toString() },
};
