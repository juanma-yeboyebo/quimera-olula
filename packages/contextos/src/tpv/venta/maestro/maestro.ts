import { MetaTabla } from "@olula/componentes/index.js";

import { Criteria, ProcesarContexto } from "@olula/lib/diseño.js";
import { ProcesarListaActivaEntidades, accionesListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { ContextoMaestroVentasTpv, EstadoMaestroVentasTpv, VentaTpv } from "../diseño.ts";
import { getVenta, getVentas, postVenta } from "../infraestructura.ts";


export const metaTablaFactura: MetaTabla<VentaTpv> = [
    {
        id: "codigo",
        cabecera: "Código",
    },
    {
        id: "fecha",
        cabecera: "Fecha",
        tipo: "fecha",
    },
    {
        id: "cliente",
        cabecera: "Cliente",
        render: (venta) => venta.cliente?.nombre ?? "Factura Simplificada",
    },
    {
        id: "total",
        cabecera: "Total",
        tipo: "moneda",
    },
];

type ProcesarVentasTpv = ProcesarContexto<EstadoMaestroVentasTpv, ContextoMaestroVentasTpv>;

const conVentas = (fn: ProcesarListaActivaEntidades<VentaTpv>) => (ctx: ContextoMaestroVentasTpv) => ({ ...ctx, ventas: fn(ctx.ventas) });

export const Ventas = accionesListaActivaEntidades(conVentas);

export const recargarVentas: ProcesarVentasTpv = async (contexto, payload) => {

    const criteria = payload as Criteria;
    const resultado = await getVentas(criteria.filtro, criteria.orden, criteria.paginacion);

    return Ventas.recargar(contexto, resultado);
}


export const ampliarVentas: ProcesarVentasTpv = async (contexto, payload) => {

    const criteria = payload as Criteria;
    const resultado = await getVentas(criteria.filtro, criteria.orden, criteria.paginacion);

    return Ventas.ampliar(contexto, resultado);
}

export const crearVenta: ProcesarVentasTpv = async (contexto) => {

    const idVenta = await postVenta();
    const venta = await getVenta(idVenta);
    return {
        ...contexto,
        ventas: {
            lista: [venta, ...contexto.ventas.lista],
            activo: venta.id,
            total: contexto.ventas.total + 1,
            criteria: contexto.ventas.criteria,
        }
    }
}

