import { metaTablaLineaVenta } from "#/ventas/venta/vistas/metatabla_linea_venta.tsx";
import { ListadoSemiControlado } from "@olula/componentes/maestro/ListadoSemiControlado.tsx";
import { useEsMovil } from "@olula/componentes/maestro/useEsMovil.ts";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QIcono } from "@olula/componentes/atomos/qicono.tsx";
import { QuimeraAcciones } from "@olula/componentes/moleculas/qacciones.tsx";
import { QEscanerCodigoBarras } from "@olula/componentes/moleculas/qescaner_codigo_barras.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { Criteria } from "@olula/lib/diseño.ts";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { ContextoError } from "@olula/lib/contexto.ts";
import { useContext, useState } from "react";
import useSound from "use-sound";
import { LineaVentaTpv as Linea } from "../../diseño.ts";
import { postLineaPorBarcode } from "../../infraestructura.ts";
import { EditarCantidadLinea } from "./EditarCantidadLinea.tsx";
import { TarjetaLinea } from "./TarjetaLinea.tsx";
import { DetalleLineaExpandido } from "./DetalleLineaExpandido.tsx";
import "./LineasLista.scss";

export type LineasListaProps<L extends Linea = Linea> = {
  ventaId?: string;
  lineas: L[];
  seleccionada?: string;
  onCambioCantidad?: (linea: L, cantidad: number) => void;
  ventaEditable?: boolean;
  cantidadEditable?: boolean;
  divisa?: string;
  acciones?: Parameters<typeof QuimeraAcciones>[0]["acciones"];
  publicar: (evento: string, payload?: unknown) => void;
};

export const LineasLista = ({
  ventaId,
  lineas,
  seleccionada,
  onCambioCantidad,
  ventaEditable,
  cantidadEditable = false,
  divisa,
  acciones,
  publicar,
}: LineasListaProps) => {
  const esMovil = useEsMovil();
  const { intentar } = useContext(ContextoError);
  const [codigoEscaneado, setCodigoEscaneado] = useState("");
  const [mostrarCamara, setMostrarCamara] = useState(false);
  const [reproducirExito] = useSound("/sound/success.mp3");
  const [reproducirError] = useSound("/sound/error.mp3");

  const setSeleccionada = (linea: Linea) => {
    if (!ventaEditable) return;
    publicar("linea_seleccionada", linea);
  };

  // Al escanear el mismo código de barras de una línea ya existente, se
  // suma cantidad en vez de crear otra línea (comparado contra el barcode
  // ya persistido en cada línea, funciona también tras recargar). Mismo
  // sonido de confirmación/error que ya tenía el escaneo en el legacy.
  const escanear = async (valor: string) => {
    const barcode = valor.trim();
    if (!barcode || !ventaId) return;

    await intentar(
      async () => {
        const lineaExistente = lineas.find((linea) => linea.barcode === barcode);

        if (lineaExistente) {
          onCambioCantidad?.(lineaExistente, lineaExistente.cantidad + 1);
        } else {
          await postLineaPorBarcode(ventaId, {
            barcode,
            cantidad: 1,
          });
          publicar("alta_linea_lista");
        }

        setCodigoEscaneado("");
        reproducirExito();
      },
      () => reproducirError()
    );
  };

  return (
    <ListadoSemiControlado
      metaTabla={{
        cols: metaTablaLineaVenta<Linea>({
          divisa,
          renderCantidad:
            cantidadEditable && onCambioCantidad
              ? (linea) => (
                  <EditarCantidadLinea
                    linea={linea}
                    onCantidadEditada={onCambioCantidad}
                  />
                )
              : undefined,
        }).filter((columna) => columna.prioridad !== "baja"),
        expansion: ({ entidad }) => (
          <DetalleLineaExpandido linea={entidad} divisa={divisa} />
        ),
      }}
      tarjeta={(linea) => (
        <TarjetaLinea
          linea={linea}
          cantidadEditable={cantidadEditable}
          onCambioCantidad={onCambioCantidad}
          divisa={divisa}
        />
      )}
      entidades={lineas}
      totalEntidades={lineas.length}
      seleccionada={lineas.find((linea) => linea.id === seleccionada) ?? null}
      onSeleccion={setSeleccionada}
      criteriaInicial={criteriaLineasDefecto}
      modoInicial={esMovil ? "tarjetas" : "tabla"}
      onCriteriaChanged={(_: Criteria) => null}
      renderAcciones={() =>
        ventaEditable ? (
          <div className="LineasLista-escaner">
            <div className="botones maestro-botones LineasLista-botones">
              <div className="LineasLista-escaneo-input">
                <QInput
                  label="Escanear código de barras"
                  nombre="escanear_barcode_linea_venta"
                  valor={codigoEscaneado}
                  onChange={setCodigoEscaneado}
                  onEnterKeyUp={escanear}
                />
                <QBoton
                  variante="borde"
                  tamaño="pequeño"
                  onClick={() => setMostrarCamara((valor) => !valor)}
                  props={{ "aria-label": "Escanear con la cámara" }}
                >
                  <QIcono nombre="codigo_barras" tamaño="sm" />
                </QBoton>

                {mostrarCamara && (
                  <QEscanerCodigoBarras
                    onDetectar={escanear}
                    onError={(error) => intentar(async () => { throw error; })}
                  />
                )}
              </div>
              {acciones && acciones.length > 0 && (
                <QuimeraAcciones acciones={acciones} />
              )}
            </div>
          </div>
        ) : null
      }
    />
  );
};

export const criteriaLineasDefecto: Criteria = {
  ...criteriaDefecto,
  orden: ["linea", "ASC"],
};
