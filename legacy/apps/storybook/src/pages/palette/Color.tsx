import { ColorVariant } from "@quimera/atomic-comps/style/Color.types";
import styles from "./Color.module.css";

interface ColorProps {
  color: ColorVariant;
}

const computedToHsl = computed => {
  return computed
    .slice(4, -2)
    .split(",")
    .map(value => value.trim())
    .map(value => (value.startsWith("calc") ? value.slice(5, -1) : value))
    .map(value =>
      value.includes("+")
        ? value
            .split("+")
            .map(v => v.trim().slice(0, -1))
            .reduce((a, b) => parseInt(a) + parseInt(b))
            .toString()
        : value,
    )
    .map(value =>
      value.includes("-")
        ? value
            .split("-")
            .map(v => v.trim().slice(0, -1))
            .reduce((a, b) => parseInt(a) - parseInt(b))
            .toString()
        : value,
    )
    .map(value => (value.endsWith("%") ? value.slice(0, -1) : value));
};

const hslToHex = computed => {
  let [h, s, l] = computedToHsl(computed);
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0"); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

export const Color = ({ color }: ColorProps) => {
  const hsl = getComputedStyle(document.documentElement).getPropertyValue(`--${color}`);
  const hex = hslToHex(hsl);

  return (
    <article className={styles.color__root}>
      <section className={styles.color__header} style={{ backgroundColor: `var(--${color})` }} />
      <section className={styles.color__body}>
        <span className={styles.color__name}>{color}</span>
        <span className={styles.color__hex}>{hex}</span>
      </section>
    </article>
  );
};
