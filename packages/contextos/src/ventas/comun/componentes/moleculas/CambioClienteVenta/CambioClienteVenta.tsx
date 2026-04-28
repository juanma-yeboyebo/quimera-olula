import { Cliente } from "#/ventas/comun/componentes/cliente.tsx";
import { DirCliente } from "#/ventas/comun/componentes/dirCliente.tsx";
import { ClienteVenta } from "#/ventas/venta/diseño.ts";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput, QModal } from "@olula/componentes/index.js";
import { Modelo } from "@olula/lib/diseño.js";
import { HookModelo, useModelo } from "@olula/lib/useModelo.ts";
import { useEffect } from "react";
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
  inicializarDesdeVenta?: boolean;
  permitirClienteNoRegistrado?: boolean;
}

const esClienteRegistrado = (clienteId: string | null | undefined) =>
  !!clienteId && clienteId !== "None";

export const CambioClienteVenta = <T extends VentaConCliente>({
  venta,
  activo = true,
  onGuardar,
  onCancelar,
  titulo = "Cambiar cliente",
  inicializarDesdeVenta = false,
  permitirClienteNoRegistrado = true,
}: CambioClienteProps<T>) => {
  const { modelo, uiProps, valido, init } = useModelo(
    metaCambioCliente,
    cambioClienteVacio
  );

  useEffect(() => {
    if (!activo) return;

    const cliente = venta.modelo.cliente;
    init({
      cliente_id: cliente.cliente_id ?? "",
      nombre_cliente: cliente.nombre_cliente ?? "",
      direccion_id: cliente.direccion_id ?? "",
      id_fiscal: cliente.id_fiscal ?? "",
      tipo_via: cliente.direccion?.tipo_via ?? "",
      nombre_via: cliente.direccion?.nombre_via ?? "",
      ciudad: cliente.direccion?.ciudad ?? "",
    });
  }, [activo, init, inicializarDesdeVenta, venta.modelo.cliente]);

  const clienteRegistrado = esClienteRegistrado(
    venta.modelo.cliente.cliente_id
  );
  const clienteNoRegistrado = !clienteRegistrado && permitirClienteNoRegistrado;

  const cambiosClienteRegistrado = (): CambioCliente => ({
    cliente_id: modelo.cliente_id,
    direccion_id: modelo.direccion_id,
  });

  const cambiosClienteNoRegistrado = (): CambioCliente => ({
    nombre_cliente: modelo.nombre_cliente,
    id_fiscal: modelo.id_fiscal,
    tipo_via: modelo.tipo_via,
    nombre_via: modelo.nombre_via,
    ciudad: modelo.ciudad,
  });

  const puedeGuardarNoRegistrado = !!(modelo.nombre_cliente ?? "").trim();

  const guardar = async () => {
    const cambios = clienteRegistrado
      ? cambiosClienteRegistrado()
      : cambiosClienteNoRegistrado();
    await onGuardar(cambios);
    init(cambioClienteVacio);
  };

  const cancelar = () => {
    onCancelar?.();
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
          {clienteNoRegistrado ? (
            <>
              <QInput
                label="Nombre del Cliente"
                {...uiProps("nombre_cliente")}
              />
              <QInput label="ID Fiscal" {...uiProps("id_fiscal")} />
              <QInput label="Tipo de Vía" {...uiProps("tipo_via")} />
              <QInput label="Nombre de la Vía" {...uiProps("nombre_via")} />
              <QInput label="Ciudad" {...uiProps("ciudad")} />
            </>
          ) : (
            <>
              <Cliente
                {...uiProps("cliente_id", "nombre_cliente")}
                nombre="cliente_id_cambio"
              />
              <DirCliente
                clienteId={modelo.cliente_id}
                {...uiProps("direccion_id")}
              />
            </>
          )}
        </quimera-formulario>

        <div className="botones maestro-botones">
          <QBoton
            onClick={guardar}
            deshabilitado={
              clienteNoRegistrado ? !puedeGuardarNoRegistrado : !valido
            }
          >
            Guardar
          </QBoton>
        </div>
      </div>
    </QModal>
  );
};
