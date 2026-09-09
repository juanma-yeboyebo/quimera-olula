import { GrupoIvaProducto } from "#/ventas/comun/componentes/grupo_iva_producto.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { FormModelo } from "@olula/lib/dominio.ts";
import { Articulo } from "../diseño.ts";
import "./TabVentas.css";

export const TabVentas = ({
  form,
}: {
  form: FormModelo;
  articulo: Articulo;
}) => {
  const { uiProps } = form;

  return (
    <div className="TabVentas">
      <quimera-formulario>
        <QInput label="Precio" {...uiProps("precio")} />
        <GrupoIvaProducto {...uiProps("grupoIvaProductoId")} />
        {/* <QCheckbox
          label="PVP variable"
          nombre="pvpVariable"
          valor={articulo.pvpVariable}
          soloLectura
        />
        <QCheckbox
          label="Sin stock"
          nombre="noStock"
          valor={articulo.noStock}
          soloLectura
        /> */}
      </quimera-formulario>
    </div>
  );
};
