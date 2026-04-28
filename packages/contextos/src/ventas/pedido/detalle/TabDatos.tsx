import { Agente } from "#/ventas/comun/componentes/agente.tsx";
import { Divisa } from "#/ventas/comun/componentes/divisa.tsx";
import { FormaPago } from "#/ventas/comun/componentes/formapago.tsx";
import { GrupoIvaNegocio } from "#/ventas/comun/componentes/grupo_iva_negocio.tsx";
import { QDate } from "@olula/componentes/atomos/qdate.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { Pedido } from "../diseño.ts";
import "./TabDatos.css";

export interface TabDatosProps {
  pedido: HookModelo<Pedido>;
}

export const TabDatosBase = ({ pedido }: TabDatosProps) => {
  const { uiProps } = pedido;

  return (
    <div className="TabDatos">
      <quimera-formulario>
        <QDate label="Fecha" {...uiProps("fecha")} />
        <Divisa {...uiProps("divisa_id")} />
        <QInput label="T. Conversión" {...uiProps("tasa_conversion")} />
        <Agente {...uiProps("agente_id", "nombre_agente")} />
        <FormaPago {...uiProps("forma_pago_id", "nombre_forma_pago")} />
        <GrupoIvaNegocio {...uiProps("grupo_iva_negocio_id")} />
      </quimera-formulario>
    </div>
  );
};
