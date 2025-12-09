import { ComponentSummary } from "@quimera/atomic-comps/Types";

import styles from "./PropertiesTable.module.css";

interface PropertiesTableProps {
  summary: ComponentSummary<any>;
}

export const PropertiesTable = ({ summary }: PropertiesTableProps) => {
  return (
    <>
      <h3>Propiedades</h3>
      <table className={styles.table__root}>
        <thead>
          <tr>
            {["Propiedad", "Tipo", "Requerida", "Por defecto"].map(header => (
              <th key={header} className={styles.header__cell}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(summary).map(([property, propertyValues]) => (
            <tr key={property} className={styles.body__row}>
              {[
                property,
                propertyValues.type,
                propertyValues.required ? "Sí" : "",
                propertyValues.default,
              ].map((value, idx) => (
                <td key={[property, idx].join("/")} className={styles.body__cell}>
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
