import { MetaTabla } from "@olula/componentes/index.js";
import { Criteria, ProcesarContexto } from "@olula/lib/diseño.js";
import { pipe } from "@olula/lib/funcional.js";
import { OportunidadVenta } from "../diseño.ts";
import { getOportunidadesVenta } from "../infraestructura.ts";
import { ContextoMaestroOportunidades, EstadoMaestroOportunidades } from "./diseño.ts";


export const metaTablaOportunidadVenta: MetaTabla<OportunidadVenta> = [
    { id: "id", cabecera: "Código" },
    { id: "descripcion", cabecera: "Descripción" },
    { id: "nombre_cliente", cabecera: "Cliente" },
    { id: "importe", cabecera: "Total", tipo: "moneda" },
    { id: "fecha_cierre", cabecera: "Fecha Cierre", tipo: "fecha" },
];

type ProcesarOportunidades = ProcesarContexto<EstadoMaestroOportunidades, ContextoMaestroOportunidades>;

const conOportunidades = (oportunidades: OportunidadVenta[]) => (ctx: ContextoMaestroOportunidades) => ({ ...ctx, oportunidades });
const conTotal = (totalOportunidades: number) => (ctx: ContextoMaestroOportunidades) => ({ ...ctx, totalOportunidades });
const conActiva = (activa: OportunidadVenta | null) => (ctx: ContextoMaestroOportunidades) => ({ ...ctx, activa });

export const recargarOportunidades: ProcesarOportunidades = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const { datos: oportunidades, total } = await getOportunidadesVenta(criteria.filtro, criteria.orden, criteria.paginacion);

    return pipe(
        contexto,
        conOportunidades(oportunidades),
        conTotal(total === -1 ? contexto.totalOportunidades : total),
        conActiva(contexto.activa
            ? oportunidades.find(oportunidad => oportunidad.id === contexto.activa?.id) ?? null
            : null)
    )
}

export const incluirOportunidadEnLista: ProcesarOportunidades = async (contexto, payload) => {
    const oportunidad = payload as OportunidadVenta;

    return pipe(
        contexto,
        conOportunidades([oportunidad, ...contexto.oportunidades])
    )
}

export const activarOportunidad: ProcesarOportunidades = async (contexto, payload) => {
    const activa = payload as OportunidadVenta;

    return pipe(
        contexto,
        conActiva(activa)
    )
}

export const desactivarOportunidadActiva: ProcesarOportunidades = async (contexto) => {
    return pipe(
        contexto,
        conActiva(null)
    )
}

export const cambiarOportunidadEnLista: ProcesarOportunidades = async (contexto, payload) => {
    const oportunidad = payload as OportunidadVenta;

    return pipe(
        contexto,
        conOportunidades(contexto.oportunidades.map(item => item.id === oportunidad.id ? oportunidad : item))
    )
}

export const quitarOportunidadDeLista: ProcesarOportunidades = async (contexto, payload) => {
    const idBorrado = payload as string;

    return pipe(
        contexto,
        conOportunidades(contexto.oportunidades.filter(oportunidad => oportunidad.id !== idBorrado)),
        conActiva(null)
    )
}
