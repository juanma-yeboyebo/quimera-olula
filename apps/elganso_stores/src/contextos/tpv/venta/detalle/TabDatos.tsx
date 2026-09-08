import { QDate } from "@olula/componentes/atomos/qdate.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { HookModelo } from "@olula/lib/useModelo.ts";
import { VentaTpv } from "../diseño.ts";
import "./TabDatos.css";

export interface TabDatosProps {
  venta: HookModelo<VentaTpv>;
}

// En El Ganso (venta TPV) no existen fecha de salida, divisa (siempre EUR)
// ni comisión de agente de cabecera — son campos del modelo genérico de
// venta sin equivalente real en tpv_comandas (confirmado contra Eneboo).
// El agente tampoco es editable: se queda el que creó la venta.
export const TabDatos = ({ venta }: TabDatosProps) => {
  const { modelo, uiProps } = venta;

  return (
    <div className="TabDatos">
      <quimera-formulario>
        <QDate label="Fecha" {...uiProps("fecha")} deshabilitado={true} />
        <QInput label="Hora" nombre="hora" valor={modelo.hora ?? ""} deshabilitado={true} />
        <QInput label="Almacén" nombre="codalmacen" valor={modelo.codalmacen ?? ""} deshabilitado={true} />
        <QInput label="Tienda" nombre="codtienda" valor={modelo.codtienda ?? ""} deshabilitado={true} />
        <QInput label="Punto de Venta" nombre="puntoVentaId" valor={modelo.puntoVentaId ?? ""} deshabilitado={true} />
        <QInput label="Código Agente" nombre="agente_id" valor={modelo.agente_id ?? ""} deshabilitado={true} />
        <QInput label="Agente" nombre="nombre_agente" valor={modelo.nombre_agente ?? ""} deshabilitado={true} />
      </quimera-formulario>
    </div>
  );
};
