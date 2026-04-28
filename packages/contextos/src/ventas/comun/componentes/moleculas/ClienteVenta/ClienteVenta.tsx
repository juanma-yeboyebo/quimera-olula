import { VentaTpv } from "#/tpv/venta/diseño.ts";
import {
  ModeloClienteVentaNoRegistrado,
  ModeloClienteVentaRegistrado,
  clienteNoRegistradoDesdeVenta,
  clienteRegistradoDesdeVenta,
  metaModeloClienteVentaNoRegistrado,
  metaModeloClienteVentaRegistrado,
} from "#/ventas/comun/componentes/moleculas/ClienteVenta/cliente_venta.ts";
import { ClienteVentaNoRegistrado } from "#/ventas/comun/componentes/moleculas/ClienteVenta/ClienteVentaNoRegistrado.tsx";
import { QBoton, QModal } from "@olula/componentes/index.js";
import { useModelo } from "@olula/lib/useModelo.js";
import { useState } from "react";
import { ClienteVentaRegistrado } from "./ClienteVentaRegistrado.tsx";

export const ClienteVenta = ({
  venta,
  guardar,
  cancelar,
}: {
  venta: VentaTpv;
  guardar: (
    cambioCliente: ModeloClienteVentaNoRegistrado | ModeloClienteVentaRegistrado
  ) => void;
  cancelar: () => void;
}) => {
  const registrado = useModelo(
    metaModeloClienteVentaRegistrado,
    clienteRegistradoDesdeVenta(venta)
  );

  const noRegistrado = useModelo(
    metaModeloClienteVentaNoRegistrado,
    clienteNoRegistradoDesdeVenta(venta)
  );

  const [tipoCliente, setTipoCliente] = useState<
    "registrado" | "no-registrado"
  >(venta.cliente?.id ? "registrado" : "no-registrado");

  const esRegistrado = tipoCliente === "registrado";

  const toggleTipo = () => {
    setTipoCliente(esRegistrado ? "no-registrado" : "registrado");
  };

  const valido = esRegistrado ? registrado.valido : noRegistrado.valido;

  return (
    <QModal
      abierto={true}
      nombre="cambiar_cliente"
      titulo="Cambiar cliente"
      onCerrar={cancelar}
    >
      <QBoton
        texto={esRegistrado ? "No registrado" : "Registrado"}
        onClick={toggleTipo}
      />

      <quimera-formulario>
        {esRegistrado ? (
          <ClienteVentaRegistrado cliente={registrado} />
        ) : (
          <ClienteVentaNoRegistrado cliente={noRegistrado} />
        )}
      </quimera-formulario>

      <div className="botones maestro-botones ">
        <QBoton texto="Cancelar" onClick={cancelar} />
        <QBoton
          texto="Guardar"
          onClick={() =>
            guardar(
              tipoCliente === "registrado"
                ? registrado.modelo
                : noRegistrado.modelo
            )
          }
          deshabilitado={!valido}
        />
      </div>
    </QModal>
  );
};
