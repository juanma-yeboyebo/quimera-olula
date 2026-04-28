import { QDate } from "@olula/componentes/atomos/qdate.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { Agente } from "../../comun/componentes/agente.tsx";
import { Divisa } from "../../comun/componentes/divisa.tsx";
import { FormaPago } from "../../comun/componentes/formapago.tsx";
import { GrupoIvaNegocio } from "../../comun/componentes/grupo_iva_negocio.tsx";
import { Presupuesto } from "../diseño.ts";
import "./TabDatos.css";

export interface TabDatosProps {
  presupuesto: HookModelo<Presupuesto>;
}

export const TabDatosBase = ({ presupuesto }: TabDatosProps) => {
  const { uiProps } = presupuesto;

  return (
    <div className="TabDatos">
      <quimera-formulario>
        <QDate label="Fecha" {...uiProps("fecha")} />
        <QDate label="Fecha salida" {...uiProps("fecha_salida")} />
        <Divisa {...uiProps("divisa_id")} />
        <QInput label="T. Conversión" {...uiProps("tasa_conversion")} />
        <Agente {...uiProps("agente_id", "nombre_agente")} />
        <FormaPago {...uiProps("forma_pago_id", "nombre_forma_pago")} />
        <GrupoIvaNegocio {...uiProps("grupo_iva_negocio_id")} />
      </quimera-formulario>
    </div>
  );
};
