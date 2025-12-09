import { Label, LabelProps, LabelSummary } from "@quimera/atomic-comps/atoms/label/Label";
import { PropertiesTable } from "../../components/PropertiesTable";

import styles from "./Labels.module.css";

const labels: LabelProps[] = [
  { children: "Campo de formulario" },
  { children: "Campo deshabilitado", disabled: true },
  { children: "Campo requerido", required: true },
  { children: "Campo con errores", hasError: true },
  { children: "Campo requerido con errores", required: true, hasError: true },
];

export const Labels = () => {
  return (
    <>
      <h1>Etiquetas</h1>
      <section className={styles.labelgroup__root}>
        {labels.map(props => (
          <Label key={props.children?.toString()} {...props} />
        ))}
      </section>
      <PropertiesTable summary={LabelSummary} />
    </>
  );
};
