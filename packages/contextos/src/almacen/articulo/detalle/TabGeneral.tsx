import { TipoCodBarras } from "#/comun/componentes/tipoCodBarras.tsx";
import { QCheckbox } from "@olula/componentes/atomos/qcheckbox.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QTextArea } from "@olula/componentes/atomos/qtextarea.tsx";
import { FormModelo } from "@olula/lib/dominio.ts";
import { Articulo } from "../diseño.ts";
// import { UsoArticulo } from "../UsoArticulo.tsx";
import "./TabGeneral.css";

export const TabGeneral = ({
  form,
  articulo,
}: {
  form: FormModelo;
  articulo: Articulo;
}) => {
  const { uiProps } = form;

  return (
    <div className="TabGeneral">
      {/* <div className="uso">{UsoArticulo(articulo)}</div> */}
      <quimera-formulario>
        <QInput
          label="Referencia"
          nombre="id"
          valor={articulo.id}
          soloLectura
        />
        <QInput label="Descripción" {...uiProps("descripcion")} />
        <QInput label="Código de barras" {...uiProps("codbarras")} />
        <TipoCodBarras {...uiProps("tipoCodBarras")} />
        <QCheckbox label="No controla stock" {...uiProps("noStock")} />
        <QTextArea label="Observaciones" {...uiProps("observaciones")} />
      </quimera-formulario>
    </div>
  );
};
