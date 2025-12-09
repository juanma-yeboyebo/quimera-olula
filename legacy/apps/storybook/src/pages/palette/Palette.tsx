import { Color } from "./Color";
import { ColorVariant } from "@quimera/atomic-comps/style/Color.types";
import styles from "./Palette.module.css";

const colorGroups = [
  {
    name: "Primary",
    colors: [
      ColorVariant.PrimaryDarker,
      ColorVariant.PrimaryDark,
      ColorVariant.Primary,
      ColorVariant.PrimaryLight,
      ColorVariant.PrimaryLighter,
    ],
  },
  {
    name: "Success",
    colors: [
      ColorVariant.SuccessDarker,
      ColorVariant.SuccessDark,
      ColorVariant.Success,
      ColorVariant.SuccessLight,
      ColorVariant.SuccessLighter,
    ],
  },
  {
    name: "Danger",
    colors: [
      ColorVariant.DangerDarker,
      ColorVariant.DangerDark,
      ColorVariant.Danger,
      ColorVariant.DangerLight,
      ColorVariant.DangerLighter,
    ],
  },
];

interface ColorGroupProps {
  title: string;
  colors: ColorVariant[];
}

const ColorGroup = ({ title, colors }: ColorGroupProps) => {
  return (
    <>
      <h2>{title}</h2>
      <section className={styles.colorgroup__root}>
        {colors.map(color => (
          <Color key={color} color={color} />
        ))}
      </section>
    </>
  );
};

export const Palette = () => {
  return (
    <>
      <h1>Paleta de colores</h1>
      {colorGroups.map(group => (
        <ColorGroup key={group.name} title={group.name} colors={group.colors} />
      ))}
    </>
  );
};
