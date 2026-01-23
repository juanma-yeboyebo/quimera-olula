import { MetaTabla } from "@olula/componentes/index.js";
import { Criteria, ProcesarContexto } from "@olula/lib/diseño.js";
import { ProcesarListaEntidades, accionesListaEntidades } from "@olula/lib/ListaEntidades.js";
import { Accion } from "../diseño.ts";
import { getAcciones } from "../infraestructura.ts";
import { ContextoMaestroAcciones, EstadoMaestroAcciones } from "./diseño.ts";

export const metaTablaAccion: MetaTabla<Accion> = [
    { id: "id", cabecera: "Código" },
    { id: "fecha", cabecera: "Fecha", tipo: "fecha" },
    { id: "descripcion", cabecera: "Descripción" },
    { id: "tipo", cabecera: "Tipo" },
    { id: "estado", cabecera: "Estado" },
];

type ProcesarAcciones = ProcesarContexto<EstadoMaestroAcciones, ContextoMaestroAcciones>;

const conAcciones = (fn: ProcesarListaEntidades<Accion>) => (ctx: ContextoMaestroAcciones) => ({ ...ctx, acciones: fn(ctx.acciones) });

export const Acciones = accionesListaEntidades(conAcciones);

export const recargarAcciones: ProcesarAcciones = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getAcciones(criteria.filtro, criteria.orden, criteria.paginacion);

    return Acciones.recargar(contexto, resultado);
}
