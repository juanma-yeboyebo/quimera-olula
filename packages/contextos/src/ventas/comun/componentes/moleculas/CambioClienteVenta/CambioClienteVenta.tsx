import { Cliente } from "#/ventas/comun/componentes/cliente.tsx";
import { DirCliente } from "#/ventas/comun/componentes/dirCliente.tsx";
import { ClienteVenta } from "#/ventas/venta/diseño.ts";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QModal } from "@olula/componentes/index.js";
import { Modelo } from "@olula/lib/diseño.js";
import { HookModelo, useModelo } from "@olula/lib/useModelo.ts";
import "./CambioClienteVenta.css";
import { CambioCliente } from "./diseño.ts";
import { cambioClienteVacio, metaCambioCliente } from "./dominio.ts";

export interface VentaConCliente extends Modelo {
  id: string;
  cliente: ClienteVenta;
}

export interface CambioClienteProps<T extends VentaConCliente> {
  venta: HookModelo<T>;
  activo?: boolean;
  onGuardar: (cambios: CambioCliente) => Promise<void>;
  onCancelar?: () => void;
  titulo?: string;
}

export const CambioClienteVenta = <T extends VentaConCliente>({
  venta: _venta,
  activo = true,
  onGuardar,
  onCancelar,
  titulo = "Cambiar cliente",
}: CambioClienteProps<T>) => {
  
  const { modelo, uiProps, valido, init } = useModelo(
    metaCambioCliente,
    cambioClienteVacio
  );

  const guardar = async () => {
    const cambios: CambioCliente = {
      cliente_id: modelo.cliente_id,
      direccion_id: modelo.direccion_id,
    };
    onGuardar(cambios);
    init(cambioClienteVacio);
  };

  const cancelar = () => {
    if (onCancelar) {
      onCancelar();
    }
    init(cambioClienteVacio);
  };

  return (
    <QModal
      abierto={activo}
      nombre="mostrar"
      titulo={titulo}
      onCerrar={cancelar}
    >
      <div className="CambioCliente">
        <quimera-formulario>
          <Cliente
            {...uiProps("cliente_id", "nombre_cliente")}
            nombre="cliente_id_cambio"
          />
          <DirCliente clienteId={modelo.cliente_id} {...uiProps("direccion_id")} />
        </quimera-formulario>

        <div className="botones maestro-botones">
          <QBoton onClick={guardar} deshabilitado={!valido}>
            Guardar
          </QBoton>
        </div>
      </div>
    </QModal>
  );
};
