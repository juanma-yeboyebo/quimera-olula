import { ListadoSemiControlado } from "@olula/componentes/maestro/ListadoSemiControlado.tsx";
import { Criteria } from "@olula/lib/diseño.ts";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { FactoryCtx } from "@olula/lib/factory_ctx.js";
import { useContext } from "react";
import { LineaPedido as Linea } from "../../diseño.ts";
import { EditarCantidadLinea } from "./EditarCantidadLinea.tsx";

export type LineasListaProps<L extends Linea = Linea> = {
  lineas: L[];
  seleccionada?: string;
  onCambioCantidad?: (linea: L, cantidad: number) => void;
  pedidoEditable?: boolean;
  publicar: (evento: string, payload?: unknown) => void;
};

export const LineasLista = (props: LineasListaProps) => {
  const { app } = useContext(FactoryCtx);
  const LineasLista_ = app.Ventas
    .pedido_detalle_lineas_LineasLista as typeof LineasListaBase;

  return LineasLista_(props);
};

export const LineasListaBase = ({
  lineas,
  seleccionada,
  onCambioCantidad,
  pedidoEditable,
  publicar,
}: LineasListaProps) => {
  const setSeleccionada = (linea: Linea) => {
    if (!pedidoEditable) return;
    publicar("linea_seleccionada", linea);
  };

  return (
    <ListadoSemiControlado
      metaTabla={getMetaTablaLineas(onCambioCantidad, pedidoEditable)}
      entidades={lineas}
      totalEntidades={lineas.length}
      seleccionada={lineas.find((linea) => linea.id === seleccionada) ?? null}
      onSeleccion={setSeleccionada}
      criteriaInicial={criteriaLineasDefecto}
      onCriteriaChanged={(_: Criteria) => null}
      modo="tabla"
    />
  );
};

const getMetaTablaLineas = (
  onCambioCantidad?: (linea: Linea, cantidad: number) => void,
  pedidoEditable?: boolean
) => {
  return [
    {
      id: "linea",
      cabecera: "Línea",
      prioridad: "alta" as const,
      render: (linea: Linea) => `${linea.referencia}: ${linea.descripcion}`,
    },
    {
      id: "cantidad",
      cabecera: "Cantidad",
      prioridad: "alta" as const,
      tipo: "numero" as const,
      render: (linea: Linea) =>
        pedidoEditable && onCambioCantidad ? (
          <EditarCantidadLinea
            linea={linea}
            onCantidadEditada={onCambioCantidad}
          />
        ) : (
          <span>{linea.cantidad}</span>
        ),
    },
    {
      id: "pvp_unitario",
      cabecera: "Precio",
      prioridad: "alta" as const,
      tipo: "moneda" as const,
    },
    {
      id: "grupo_iva_producto_id",
      cabecera: "IVA",
      prioridad: "media" as const,
      render: (linea: Linea) =>
        linea.grupo_iva_producto_id ? `${linea.grupo_iva_producto_id}%` : "",
    },
    {
      id: "dto_porcentual",
      cabecera: "% Dto.",
      prioridad: "media" as const,
      render: (linea: Linea) =>
        linea.dto_porcentual ? `${linea.dto_porcentual}%` : "",
    },
    {
      id: "pvp_total",
      cabecera: "Total",
      prioridad: "alta" as const,
      tipo: "moneda" as const,
    },
  ];
};

const criteriaLineasDefecto: Criteria = {
  ...criteriaDefecto,
  orden: ["linea", "ASC"],
};
