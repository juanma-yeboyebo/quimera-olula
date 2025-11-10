import { Cliente } from "#/ventas/comun/componentes/cliente.tsx";
import { DirCliente } from "#/ventas/comun/componentes/dirCliente.tsx";
import { Presupuesto } from "#/ventas/presupuesto/diseño.ts";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.js";
import { HookModelo, useModelo } from "@olula/lib/useModelo.ts";
import { useContext } from "react";
import { cambioClienteVacio, metaCambioCliente } from "../../../dominio.ts";
import {
  getPresupuesto,
  patchCambiarCliente,
} from "../../../infraestructura.ts";
import "./CambioCliente.css";

export const CambioCliente = ({
  presupuesto,
  publicar = () => {},
  emitir = () => {},
}: {
  presupuesto: HookModelo<Presupuesto>;
  publicar: (evento: string, payload?: unknown) => void;
  emitir: (evento: string) => void;
}) => {
  const presupuestoId = presupuesto.modelo.id;
  const { intentar } = useContext(ContextoError);
  const { modelo, uiProps, valido, init } = useModelo(
    metaCambioCliente,
    cambioClienteVacio()
  );

  const guardar = async () => {
    let cambios;
    if (presupuesto.modelo.cliente_id === "None") {
      cambios = {
        nombre_cliente: presupuesto.modelo.nombre_cliente,
        id_fiscal: presupuesto.modelo.id_fiscal,
        tipo_via: presupuesto.modelo.tipo_via,
        nombre_via: presupuesto.modelo.nombre_via,
        ciudad: presupuesto.modelo.ciudad,
      };
    } else {
      cambios = {
        cliente_id: modelo.cliente_id,
        direccion_id: modelo.direccion_id,
      };
    }

    await intentar(() => patchCambiarCliente(presupuestoId, cambios));
    const nuevoPresupuesto = await getPresupuesto(presupuestoId);
    publicar("presupuesto_cambiado", nuevoPresupuesto);
    emitir("cambio_cliente_listo");
    init(cambioClienteVacio());
  };
  return (
    <div className="CambioCliente">
      <h2>Cambiar cliente</h2>

      <quimera-formulario>
        {presupuesto.modelo.cliente_id !== "None" ? (
          <>
            <Cliente
              {...uiProps("cliente_id", "nombre_cliente")}
              nombre="cliente_id_cambio"
            />
            <DirCliente
              clienteId={modelo.cliente_id || presupuesto.modelo.cliente_id}
              {...uiProps("direccion_id")}
            />
          </>
        ) : (
          <>
            <QInput
              label="Nombre del Cliente"
              {...presupuesto.uiProps("nombre_cliente")}
            />
            <QInput label="ID Fiscal" {...presupuesto.uiProps("id_fiscal")} />

            <QInput label="Tipo de Vía" {...presupuesto.uiProps("tipo_via")} />
            <QInput
              label="Nombre de la Vía"
              {...presupuesto.uiProps("nombre_via")}
            />
            <QInput label="Ciudad" {...presupuesto.uiProps("ciudad")} />
          </>
        )}
      </quimera-formulario>

      <div className="botones maestro-botones ">
        <QBoton onClick={guardar} deshabilitado={!valido}>
          Guardar
        </QBoton>
      </div>
    </div>
  );
};
