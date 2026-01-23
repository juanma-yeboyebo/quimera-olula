import { MetaTabla } from "@olula/componentes/index.js";
import { Criteria, ProcesarContexto } from "@olula/lib/diseño.js";
import { pipe } from "@olula/lib/funcional.js";
import { EstadoOportunidad } from "../diseño.ts";
import { getEstadosOportunidad } from "../infraestructura.ts";
import { ContextoMaestroEstadosOportunidad, EstadoMaestroEstadosOportunidad } from "./diseño.ts";

export const metaTablaEstadoOportunidad: MetaTabla<EstadoOportunidad> = [
    { id: "id", cabecera: "Código" },
    { id: "descripcion", cabecera: "Descripción" },
    { id: "probabilidad", cabecera: "Probabilidad", tipo: "numero" },
    { id: "valor_defecto", cabecera: "Por defecto", tipo: "booleano" },
];

type ProcesarEstadosOportunidad = ProcesarContexto<EstadoMaestroEstadosOportunidad, ContextoMaestroEstadosOportunidad>;

// const conEstado = (estado: EstadoMaestroEstadosOportunidad) => (ctx: ContextoMaestroEstadosOportunidad) => ({ ...ctx, estado });
const conEstadosOportunidad = (estados_oportunidad: EstadoOportunidad[]) => (ctx: ContextoMaestroEstadosOportunidad) => ({ ...ctx, estados_oportunidad });
const conTotal = (totalEstadosOportunidad: number) => (ctx: ContextoMaestroEstadosOportunidad) => ({ ...ctx, totalEstadosOportunidad });
const conActivo = (activo: EstadoOportunidad | null) => (ctx: ContextoMaestroEstadosOportunidad) => ({ ...ctx, activo });

export const recargarEstadosOportunidad: ProcesarEstadosOportunidad = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const { datos: estados_oportunidad, total } = await getEstadosOportunidad(criteria.filtro, criteria.orden, criteria.paginacion);

    return pipe(
        contexto,
        conEstadosOportunidad(estados_oportunidad),
        conTotal(total === -1 ? contexto.totalEstadosOportunidad : total),
        conActivo(contexto.activo
            ? estados_oportunidad.find(estado_oportunidad => estado_oportunidad.id === contexto.activo?.id) ?? null
            : null)
    )
}

export const incluirEstadoOportunidadEnLista: ProcesarEstadosOportunidad = async (contexto, payload) => {
    const estado_oportunidad = payload as EstadoOportunidad;

    return pipe(
        contexto,
        conEstadosOportunidad([estado_oportunidad, ...contexto.estados_oportunidad])
    )
}

export const activarEstadoOportunidad: ProcesarEstadosOportunidad = async (contexto, payload) => {
    const activo = payload as EstadoOportunidad;

    return pipe(
        contexto,
        conActivo(activo)
    )
}

export const desactivarEstadoOportunidadActivo: ProcesarEstadosOportunidad = async (contexto) => {
    return pipe(
        contexto,
        conActivo(null)
    )
}

export const cambiarEstadoOportunidadEnLista: ProcesarEstadosOportunidad = async (contexto, payload) => {
    const estado_oportunidad = payload as EstadoOportunidad;

    return pipe(
        contexto,
        conEstadosOportunidad(contexto.estados_oportunidad.map(item => item.id === estado_oportunidad.id ? estado_oportunidad : item))
    )
}

export const quitarEstadoOportunidadDeLista: ProcesarEstadosOportunidad = async (contexto, payload) => {
    const idBorrado = payload as string;

    return pipe(
        contexto,
        conEstadosOportunidad(contexto.estados_oportunidad.filter(estado_oportunidad => estado_oportunidad.id !== idBorrado)),
        conActivo(null)
    )
}
