import { Button, ButtonProps, ButtonSummary } from "@quimera/atomic-comps/atoms/button/Button";
import { PropertiesTable } from "../../components/PropertiesTable";

import styles from "./Buttons.module.css";

const buttonGroups = [
  {
    name: "Por defecto",
    combinations: [{ children: "Por defecto" }],
  },
  {
    name: "Por estilo y variante",
    combinations: [
      { style: "text" },
      { style: "contained" },
      { style: "outlined" },
      { style: "text", variant: "secondary" },
      { style: "contained", variant: "secondary" },
      { style: "outlined", variant: "secondary" },
      { style: "text", variant: "success" },
      { style: "contained", variant: "success" },
      { style: "outlined", variant: "success" },
      { style: "text", variant: "danger" },
      { style: "contained", variant: "danger" },
      { style: "outlined", variant: "danger" },
    ],
  },
  {
    name: "Desahibilitados",
    combinations: [
      { style: "text", disabled: true, children: "Disabled Text" },
      { style: "contained", disabled: true, children: "Disabled Contained" },
      { style: "outlined", disabled: true, children: "Disabled Outlined" },
    ],
  },
  {
    name: "Tamaños",
    combinations: [
      { style: "contained", size: "small", children: "Small Size" },
      { style: "contained", size: "regular", children: "Regular Size" },
      { style: "contained", size: "large", children: "Large Size" },
    ],
  },
];

interface ButtonGroupProps {
  title: string;
  combinations: ButtonProps[];
}

const ButtonGroup = ({ title, combinations }: ButtonGroupProps) => {
  return (
    <>
      <h2>{title}</h2>
      <section className={styles.buttongroup__root}>
        {combinations.map((props, idx) => (
          <article key={idx}>
            <Button {...props}>
              {props.children ?? `${props.variant ?? "Primary"} ${props.style ?? "Text"}`}
            </Button>
          </article>
        ))}
      </section>
    </>
  );
};

export const Buttons = () => {
  return (
    <>
      <h1>Botones</h1>
      {buttonGroups.map(group => (
        <ButtonGroup
          key={group.name}
          title={group.name}
          combinations={group.combinations as ButtonProps[]}
        />
      ))}
      <PropertiesTable summary={ButtonSummary} />
    </>
  );
};
