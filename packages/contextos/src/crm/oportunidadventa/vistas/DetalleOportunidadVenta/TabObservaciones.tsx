import { QTextArea } from "@olula/componentes/atomos/qtextarea.tsx";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { OportunidadVenta } from "../../diseño.ts";
import "./TabObservaciones.css";

export const TabObservaciones = ({
  oportunidad,
}: {
  oportunidad: HookModelo<OportunidadVenta>;
}) => {
  const { uiProps } = oportunidad;

  return (
    <div className="TabObservaciones">
      <quimera-formulario>
        <QTextArea
          label="Observaciones"
          rows={5}
          {...uiProps("observaciones")}
        />
      </quimera-formulario>
    </div>
  );
};
