import { Pedido } from "#/ventas/pedido/diseño.ts";
import {
  QModalConfirmacion,
  QTarjetas,
  QuimeraAcciones,
} from "@olula/componentes/index.ts";
import { Criteria, ListaSeleccionable } from "@olula/lib/diseño.js";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { getSeleccionada } from "@olula/lib/entidad.ts";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { EstadoAlbaranarPedido } from "../../detalle/diseño.ts";
import { puedeAlbaranar } from "../../detalle/dominio.ts";
import { LineaAlbaranarPedido as Linea } from "../../diseño.ts";
import TarjetaLinea from "./TarjetaLinea.tsx";

export const Lineas = ({
  pedido,
  lineas,
  estado,
  publicar,
}: {
  pedido: Pedido;
  lineas: ListaSeleccionable<Linea>;
  estado: EstadoAlbaranarPedido;
  publicar: ProcesarEvento;
}) => {
  const seleccionada = getSeleccionada(lineas);

  const albaranarPedido = () => {
    publicar("albaranado_confirmado");
  };

  const esConfirmandoAlbaranado = estado === "CONFIRMANDO_ALBARANADO";
  const esAlbaranadoCompletado = estado === "ALBARANADO_COMPLETADO";

  const habilitarBoton = puedeAlbaranar({ pedido, lineas });
  const acciones = [
    {
      texto: "Generar Albaran",
      onClick: () => publicar("albaranado_solicitado"),
      deshabilitado: !habilitarBoton,
    },
  ];

  return (
    <div className="DetalleAlbaranarPedido">
      <div className="CabeceraPedido">
        <div className="botones maestro-botones ">
          <QuimeraAcciones acciones={acciones} />
        </div>
      </div>
      <QTarjetas
        tarjeta={(l: Linea) => (
          <TarjetaLinea linea={l} pedidoId={pedido.id} publicar={publicar} />
        )}
        datos={lineas.lista}
        cargando={estado === "ALBARANANDO"}
        seleccionadaId={seleccionada?.id}
        onSeleccion={(l: Linea) => publicar("linea_seleccionada", l.id)}
        onOrdenar={(_: string) => null}
        criteria={criteria_tarjetas}
      />
      <QModalConfirmacion
        nombre="albaranarPedido"
        abierto={esConfirmandoAlbaranado || esAlbaranadoCompletado}
        titulo={esConfirmandoAlbaranado ? "Confirmar" : "Albarán generado"}
        mensaje={
          esConfirmandoAlbaranado
            ? "¿Está seguro de que desea albaranar este pedido?"
            : "El pedido se ha albaranado correctamente."
        }
        labelAceptar={esConfirmandoAlbaranado ? "Aceptar" : "Entendido"}
        mostrarCancelar={esConfirmandoAlbaranado}
        onCerrar={() =>
          publicar(
            esConfirmandoAlbaranado
              ? "albaranado_cancelado"
              : "albaranado_completado_cerrado"
          )
        }
        onAceptar={() =>
          esConfirmandoAlbaranado
            ? albaranarPedido()
            : publicar("albaranado_completado_cerrado")
        }
      />
    </div>
  );
};

const criteria_tarjetas: Criteria = {
  ...criteriaDefecto,
  orden: ["id", "DESC"],
};
