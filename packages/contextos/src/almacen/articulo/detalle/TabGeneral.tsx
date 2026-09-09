import { QCheckbox } from "@olula/componentes/atomos/qcheckbox.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QTextArea } from "@olula/componentes/atomos/qtextarea.tsx";
import { Articulo } from "../diseño.ts";
import "./TabGeneral.css";

export const TabGeneral = ({ articulo }: { articulo: Articulo }) => (
  <div className="TabGeneral">
    <quimera-formulario>
      <QInput label="Referencia" nombre="id" valor={articulo.id} soloLectura />
      <QInput
        label="Descripción"
        nombre="descripcion"
        valor={articulo.descripcion}
        soloLectura
      />
      <QCheckbox
        label="Se vende"
        nombre="seVende"
        valor={articulo.seVende}
        soloLectura
      />
      <QCheckbox
        label="Se compra"
        nombre="seCompra"
        valor={articulo.seCompra}
        soloLectura
      />
      <QCheckbox
        label="Sin stock"
        nombre="noStock"
        valor={articulo.noStock}
        soloLectura
      />
      <QTextArea
        label="Observaciones"
        nombre="observaciones"
        valor={articulo.observaciones}
        soloLectura
      />
    </quimera-formulario>
  </div>
);
