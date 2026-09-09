import { ColumnaEstadoTabla } from "#/comun/componentes/ColumnaEstadoTabla.tsx";
import { MetaTabla } from "@olula/componentes/index.js";
import { VentaTpv } from "../diseño.ts";
import { colorDeEstado, iconosEstado } from "./configEstado.tsx";

export const getMetaTablaVentaTpv = () => metaTablaVentaTpv;

const ColumnaEstadoVentaTpv = ({ venta }: { venta: VentaTpv }) => (
  <ColumnaEstadoTabla
    estados={iconosEstado}
    estadoActual={colorDeEstado(venta.estado ?? "")}
  />
);

const metaTablaVentaTpv: MetaTabla<VentaTpv> = [
  {
    id: "estado",
    cabecera: "",
    render: (venta: VentaTpv) => <ColumnaEstadoVentaTpv venta={venta} />,
  },
  {
    id: "codigo",
    cabecera: "Código",
    prioridad: "alta",
  },
  {
    id: "nombre_cliente",
    cabecera: "Cliente",
    prioridad: "alta",
    render: (v) => v.cliente?.nombre ?? "",
  },
  {
    id: "fecha",
    cabecera: "Fecha",
    tipo: "fecha",
    prioridad: "alta",
  },
  {
    id: "total",
    cabecera: "Total",
    tipo: "moneda",
    prioridad: "alta",
    divisa: (venta) => venta.divisa_id,
  },
  {
    id: "nombre_agente",
    cabecera: "Agente",
    prioridad: "baja",
  },
  {
    id: "puntoVenta",
    cabecera: "Punto de Venta",
    prioridad: "baja",
    render: (v) => v.puntoVenta || v.puntoVentaId,
  },
];
