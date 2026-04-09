import { QIcono, QTarjetas, getIdUnico } from "@olula/componentes/index.js";
import { ContextoError } from "@olula/lib/contexto.ts";
import { Criteria } from "@olula/lib/diseño.js";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useContext, useState } from "react";
import { LineaAlbaranarPedido, Tramo } from "../../diseño.ts";
import { obtenerClaseEstadoAlbaranado } from "../../dominio.ts";
import { patchCerrarLineaPedido } from "../../infraestructura.ts";
import "./TarjetaLinea.css";
import { TarjetaTramo } from "./tramo/TarjetaTramo.tsx";

export const TarjetaLinea = ({
  linea,
  pedidoId,
  publicar,
}: {
  linea: LineaAlbaranarPedido;
  pedidoId: string;
  publicar: ProcesarEvento;
}) => {
  const usaLotes = false;
  const usaUbicaciones = false;

  const { intentar } = useContext(ContextoError);
  const tramos = linea.tramos ?? [];

  const servida = linea.servida || 0;
  const aEnviar =
    tramos.length > 0
      ? tramos.reduce(
          (total, tramo) => total + (Number(tramo.cantidad) || 0),
          0
        )
      : linea.a_enviar || 0;
  const disponible = linea.cantidad - servida - aEnviar;

  const [mostrarTramos, setMostrarTramos] = useState(false);
  const [tramoSeleccionadoId, setTramoSeleccionadoId] = useState<string>();

  const getMaximoPermitido = (tramoEditado: Tramo) => {
    const sumaSinTramoActual = tramos.reduce((total, tramo) => {
      if (tramo.id === tramoEditado.id) {
        return total;
      }
      return total + (tramo.cantidad || 0);
    }, 0);

    return Math.max(0, linea.cantidad - sumaSinTramoActual);
  };

  const cambiarEstadoLinea = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!linea.id) return;

    const nuevaCerrada = !linea.cerrada;
    await intentar(() =>
      patchCerrarLineaPedido(pedidoId, linea.id, nuevaCerrada)
    );
    publicar("linea_cerrada_actualizada", {
      id: linea.id,
      cerrada: nuevaCerrada,
    });
  };

  const addTramo = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (disponible <= 0) {
      alert("No hay cantidad disponible para añadir más tramos.");
      return;
    }

    const nuevo: Tramo = {
      id: getIdUnico(),
      cantidad: disponible,
    };
    const actuales = tramos;
    const nuevos = [...actuales, nuevo];
    publicar("tramos_actualizados", {
      id: linea.id,
      tramos: nuevos,
    });
    setMostrarTramos(true);
  };

  const claseTarjeta = `tarjeta-cabecera-info ${obtenerClaseEstadoAlbaranado({
    ...linea,
    a_enviar: aEnviar,
  })}`.trim();

  return (
    <div className="TarjetaLinea">
      <div className="tarjeta-cabecera">
        <div className={claseTarjeta}>
          {`${linea.referencia || "-"} ${linea.descripcion || ""}`}
          <div>Cantidad: {linea.cantidad}</div>
          <div>Servida: {servida}</div>
          <div>A enviar: {aEnviar}</div>
        </div>
        <div className="tarjeta-cabecera-acciones">
          <button
            onClick={cambiarEstadoLinea}
            title={linea.cerrada ? "Abrir línea" : "Cerrar línea"}
          >
            <QIcono
              nombre={linea.cerrada ? "candado" : "candado_abierto"}
              tamaño="sm"
            />
          </button>
          <button
            onClick={addTramo}
            disabled={linea.cerrada || disponible <= 0}
            title={
              disponible <= 0
                ? "No hay cantidad disponible"
                : `Añadir tramo con ${disponible} unidades`
            }
          >
            <QIcono nombre="añadir" tamaño="sm" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMostrarTramos(!mostrarTramos);
            }}
            disabled={aEnviar == 0}
          >
            <QIcono
              nombre={mostrarTramos ? "abajo" : "derecha"}
              tamaño="sm"
              color={
                aEnviar == 0 ? "--color-deshabilitado" : "--color-primario"
              }
            />
          </button>
        </div>
      </div>

      <div className="tarjeta-tramos">
        <div className="tramos-lista">
          {mostrarTramos && tramos.length > 0 && (
            <QTarjetas
              tarjeta={(tramo: Tramo) => (
                <TarjetaTramo
                  tramo={tramo}
                  maximoPermitido={getMaximoPermitido(tramo)}
                  deshabilitado={linea.cerrada || false}
                  usaLotes={usaLotes}
                  usaUbicaciones={usaUbicaciones}
                  lineaId={linea.id}
                  publicar={publicar}
                />
              )}
              datos={tramos}
              cargando={false}
              seleccionadaId={tramoSeleccionadoId}
              onSeleccion={(tramo: Tramo) =>
                setTramoSeleccionadoId(String(tramo.id))
              }
              onOrdenar={(_: string) => null}
              criteria={criteria_tarjetas}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TarjetaLinea;

const criteria_tarjetas: Criteria = {
  ...criteriaDefecto,
  orden: ["id", "DESC"],
}
