import { QBoton } from "@olula/componentes/index.js";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.js";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { puede } from "@olula/lib/dominio.ts";
import { useLista } from "@olula/lib/useLista.ts";
import { Maquina, useMaquina } from "@olula/lib/useMaquina.ts";
import { useState } from "react";
import { Cliente } from "../diseño.ts";
import { metaTablaCliente } from "../dominio.ts";
import { getClientes } from "../infraestructura.ts";
import { AltaCliente } from "./AltaCliente.tsx";
import { DetalleCliente } from "./DetalleCliente/DetalleCliente.tsx";
import "./MaestroConDetalleCliente.css";

type Estado = "lista" | "alta";
export const MaestroConDetalleCliente = () => {
  const [estado, setEstado] = useState<Estado>("lista");
  const clientes = useLista<Cliente>([]);

  const maquina: Maquina<Estado> = {
    alta: {
      cliente_creado: (payload) => {
        const cliente = payload as Cliente;
        clientes.añadir(cliente);
        return "lista";
      },
      alta_cancelada: "lista",
    },
    lista: {
      alta_iniciada: "alta",
      cliente_cambiado: (payload) => {
        const cliente = payload as Cliente;
        clientes.modificar(cliente);
      },
      cliente_borrado: (payload) => {
        const cliente = payload as Cliente;
        clientes.eliminar(cliente);
      },
      cancelar_seleccion: () => {
        clientes.limpiarSeleccion();
      },
    },
  };

  const emitir = useMaquina(maquina, estado, setEstado);

  const puedeCrear = puede("ventas.cliente.crear");

  return (
    <div className="Cliente">
      <MaestroDetalle<Cliente>
        preMaestro={
          <>
            <h2>Clientes</h2>
            <div className="maestro-botones">
              {puedeCrear && (
                <QBoton onClick={() => emitir("alta_iniciada")}>Nuevo</QBoton>
              )}
            </div>
          </>
        }
        modoVisualizacion="tabla"
        modoDisposicion="maestro-50"
        metaTabla={metaTablaCliente}
        // tarjeta={(cliente) => <TarjetaCliente cliente={cliente} />}
        entidades={clientes.lista}
        setEntidades={clientes.setLista}
        seleccionada={clientes.seleccionada}
        setSeleccionada={clientes.seleccionar}
        cargar={getClientes}
        Detalle={
          <DetalleCliente
            clienteInicial={clientes.seleccionada}
            emitir={emitir}
          />
        }
      />
      <QModal
        nombre="modal"
        abierto={estado === "alta"}
        onCerrar={() => emitir("alta_cancelada")}
      >
        <AltaCliente emitir={emitir} />
      </QModal>
    </div>
  );
};
