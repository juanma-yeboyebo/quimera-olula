import { QTextArea } from "@olula/componentes/atomos/qtextarea.tsx";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { Accion } from "../../diseño.ts";

export const TabObservaciones = ({
  accion,
}: {
  accion: HookModelo<Accion>;
}) => {
  const { uiProps } = accion;

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
