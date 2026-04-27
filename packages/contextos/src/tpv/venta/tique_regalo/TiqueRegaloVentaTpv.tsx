import {
  LineaFactura,
  LineaParaTiqueRegalo,
  VentaTpv,
} from "#/tpv/venta/diseño.ts";
import { postReportTiqueRegalo } from "#/tpv/venta/infraestructura.ts";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { MetaTabla, QModal } from "@olula/componentes/index.js";
import { ListadoSemiControlado } from "@olula/componentes/maestro/ListadoSemiControlado.tsx";
import { ContextoError } from "@olula/lib/contexto.js";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { imprimir_blob } from "@olula/lib/impresion.ts";
import { useCallback, useContext, useState } from "react";
import { CantidadATiqueRegalo } from "./CantidadATiqueRegalo.tsx";
import "./TiqueRegaloVentaTpv.css";

export const TiqueRegaloVentaTpv = ({
  venta,
  lineas,
  publicar,
}: {
  venta: VentaTpv;
  lineas: LineaFactura[];
  publicar: EmitirEvento;
}) => {
  const { intentar } = useContext(ContextoError);

  const [lineasParaTique, setLineasParaTique] = useState<LineaParaTiqueRegalo[]>(
    lineas.map(l => ({ ...l, aTiqueRegalo: l.cantidad }))
  );
  const [generando, setGenerando] = useState(false);

  const cambiarCantidadATiqueRegalo = (
    linea: LineaParaTiqueRegalo,
    aTiqueRegalo: number
  ) => {
    setLineasParaTique(prev =>
      prev.map(l => l.id === linea.id ? { ...l, aTiqueRegalo } : l)
    );
  };

  const generarTique = useCallback(
    async () => {
      setGenerando(true);
      const blob = await intentar(() => postReportTiqueRegalo(venta.id, lineasParaTique));
      if (blob) {
        imprimir_blob(blob);
      }
      publicar("tique_regalo_generado");
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lineasParaTique, venta, publicar]
  );

  const cancelar = useCallback(() => {
    if (!generando) publicar("tique_regalo_cancelado");
  }, [generando, publicar]);

  const puedoGenerar = lineasParaTique.some(l => l.aTiqueRegalo > 0);

  return (
    <QModal abierto={true} nombre="mostrar" onCerrar={cancelar}>
      <div className="TiqueRegaloVentaTpv">
        <h2>{`Tique regalo venta ${venta.codigo}`}</h2>

        <ListadoSemiControlado
          metaTabla={getMetaTablaLineas(cambiarCantidadATiqueRegalo)}
          entidades={lineasParaTique}
          totalEntidades={lineasParaTique.length}
          cargando={false}
          seleccionada={null}
          onSeleccion={() => null}
          criteriaInicial={criteriaDefecto}
          onCriteriaChanged={() => null}
          modo="tabla"
        />

        <div className="botones maestro-botones ">
          <QBoton
            texto="Cancelar"
            onClick={cancelar}
          />
          <QBoton
            texto="Generar tique"
            deshabilitado={!puedoGenerar}
            onClick={generarTique}
          />
        </div>
      </div>
    </QModal>
  );
};

const getMetaTablaLineas = (
  cambiarCantidadATiqueRegalo: (linea: LineaParaTiqueRegalo, cantidad: number) => void
): MetaTabla<LineaParaTiqueRegalo> => {
  return [
    {
      id: "linea",
      cabecera: "Línea",
      render: (linea: LineaParaTiqueRegalo) =>
        `${linea.referencia}: ${linea.descripcion}`,
    },
    {
      id: "cantidad",
      cabecera: "Cantidad",
      tipo: "numero",
    },
    {
      id: "aTiqueRegalo",
      tipo: "numero",
      cabecera: "A incluir",
      render: (linea: LineaParaTiqueRegalo) => (
        <CantidadATiqueRegalo
          linea={linea}
          onCantidadEditada={cambiarCantidadATiqueRegalo}
        />
      ),
    },
    { id: "pvp_unitario", cabecera: "Precio", tipo: "moneda" },
    {
      id: "dto_porcentual",
      cabecera: "% Dto.",
      tipo: "numero",
      render: (linea: LineaParaTiqueRegalo) =>
        linea.dto_porcentual ? `${linea.dto_porcentual}%` : "",
    },
    { id: "pvp_total", cabecera: "Total", tipo: "moneda" },
  ];
};
