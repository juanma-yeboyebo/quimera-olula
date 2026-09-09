import { TipoCodBarras } from "#/comun/componentes/tipoCodBarras.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QTextArea } from "@olula/componentes/atomos/qtextarea.tsx";
import { FormModelo } from "@olula/lib/dominio.ts";
import "./TabGeneral.css";

export const TabGeneral = ({
  form,
  articuloId,
}: {
  form: FormModelo;
  articuloId: string;
}) => {
  const { uiProps } = form;

  return (
    <div className="TabGeneral">
      <quimera-formulario>
        <QInput label="Referencia" nombre="id" valor={articuloId} soloLectura />
        <QInput label="Descripción" {...uiProps("descripcion")} />
        <QInput label="Código de barras" {...uiProps("codbarras")} />
        <TipoCodBarras {...uiProps("tipoCodBarras")} />
        <QTextArea label="Observaciones" {...uiProps("observaciones")} />
      </quimera-formulario>
    </div>
  );
};
