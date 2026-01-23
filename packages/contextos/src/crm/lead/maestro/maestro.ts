import { MetaTabla } from "@olula/componentes/index.js";
import { Criteria, ProcesarContexto } from "@olula/lib/diseño.js";
import { pipe } from "@olula/lib/funcional.js";
import { Lead } from "../diseño.ts";
import { getLeads } from "../infraestructura.ts";
import { ContextoMaestroLeads, EstadoMaestroLeads } from "./diseño.ts";

export const metaTablaLead: MetaTabla<Lead> = [
    { id: "id", cabecera: "Código" },
    { id: "nombre", cabecera: "Nombre" },
    { id: "tipo", cabecera: "Tipo" },
    { id: "estado_id", cabecera: "Estado" },
    { id: "fuente_id", cabecera: "Fuente" },
];

type ProcesarLeads = ProcesarContexto<EstadoMaestroLeads, ContextoMaestroLeads>;

// const conEstado = (estado: EstadoMaestroLeads) => (ctx: ContextoMaestroLeads) => ({ ...ctx, estado });
const conLeads = (leads: Lead[]) => (ctx: ContextoMaestroLeads) => ({ ...ctx, leads });
const conTotal = (totalLeads: number) => (ctx: ContextoMaestroLeads) => ({ ...ctx, totalLeads });
const conActivo = (activo: Lead | null) => (ctx: ContextoMaestroLeads) => ({ ...ctx, activo });

export const recargarLeads: ProcesarLeads = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const { datos: leads, total } = await getLeads(criteria.filtro, criteria.orden, criteria.paginacion);

    return pipe(
        contexto,
        conLeads(leads),
        conTotal(total === -1 ? contexto.totalLeads : total),
        conActivo(contexto.activo
            ? leads.find(lead => lead.id === contexto.activo?.id) ?? null
            : null)
    )
}

export const incluirLeadEnLista: ProcesarLeads = async (contexto, payload) => {
    const lead = payload as Lead;

    return pipe(
        contexto,
        conLeads([lead, ...contexto.leads])
    )
}

export const activarLead: ProcesarLeads = async (contexto, payload) => {
    const activo = payload as Lead;

    return pipe(
        contexto,
        conActivo(activo)
    )
}

export const desactivarLeadActivo: ProcesarLeads = async (contexto) => {
    return pipe(
        contexto,
        conActivo(null)
    )
}

export const cambiarLeadEnLista: ProcesarLeads = async (contexto, payload) => {
    const lead = payload as Lead;

    return pipe(
        contexto,
        conLeads(contexto.leads.map(item => item.id === lead.id ? lead : item))
    )
}

export const quitarLeadDeLista: ProcesarLeads = async (contexto, payload) => {
    const idBorrado = payload as string;

    return pipe(
        contexto,
        conLeads(contexto.leads.filter(lead => lead.id !== idBorrado)),
        conActivo(null)
    )
}
