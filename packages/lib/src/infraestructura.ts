import { RestAPI } from "./api/rest_api.ts";
import { ClausulaFiltro, Criteria, Filtro, OpcionCampo, Orden, Paginacion } from "./diseño.ts";

export const criteriaAQueryString = (criteria: Criteria): string => {
    return criteriaQuery(criteria.filtro, criteria.orden, criteria.paginacion);
}

export const criteriaQuery = (filtro?: Filtro, orden?: Orden, paginacion?: Paginacion): string => {
    if (!filtro && !orden) {
        return "";
    }

    const criteria = transformarCriteria(filtro, orden, paginacion);
    return aplicarCriteriaUrl(criteria);
}

export const criteriaQueryUrl = (filtro?: Filtro, orden?: Orden): string => {
    if (!filtro && !orden) {
        return "";
    }

    const criteria = transformarCriteria(filtro, orden);
    return aplicarCriteriaUrl(criteria);
}

export const aplicarCriteriaUrl = (criteria: Criteria): string => {
    return `?q=${JSON.stringify(criteria)}`;
}

export const transformarCriteria = (filtro?: Filtro, orden?: Orden, paginacion?: Paginacion): Criteria => {
    const res: Partial<Criteria> = {};
    if (filtro) {
        // res['filtro'] = transformarFiltro(filtro);
        res['filtro'] = filtro.map(transformarFiltrosEspeciales);
    }
    if (orden) {
        // res['orden'] = transformarOrden(orden);
        res['orden'] = orden;
    }
    if (paginacion) {
        res['paginacion'] = paginacion;
    }
    return res as Criteria;
}

const hoy = new Date();

const filtrosEspeciales: Record<string, (campo: string) => ClausulaFiltro> = {
    "@hoy": (campo: string) => {
        return [campo, "<>", [hoy, hoy].map(d => d.toISOString().slice(0, 10)).join("_")];
    },
    "@ayer": (campo: string) => {
        const ayer = new Date(hoy);
        ayer.setDate(hoy.getDate() - 1);
        return [campo, "<>", [ayer, ayer].map(d => d.toISOString().slice(0, 10)).join("_")];
    },
    "@mañana": (campo: string) => {
        const mañana = new Date(hoy);
        mañana.setDate(hoy.getDate() + 1);
        return [campo, "<>", [mañana, mañana].map(d => d.toISOString().slice(0, 10)).join("_")];
    },
    "@esta-semana": (campo: string) => {
        const dia = hoy.getDay() || 7;

        const primero = new Date(hoy);
        primero.setDate(hoy.getDate() - (dia - 1));

        const ultimo = new Date(hoy);
        ultimo.setDate(hoy.getDate() + (7 - dia));

        return [campo, "<>", [primero, ultimo].map(d => d.toISOString().slice(0, 10)).join("_")];
    },
    "@semana-anterior": (campo: string) => {
        const dia = hoy.getDay() || 7;

        const primero = new Date(hoy);
        primero.setDate(hoy.getDate() - (dia - 1) - 7);

        const ultimo = new Date(hoy);
        ultimo.setDate(hoy.getDate() + (7 - dia) - 7);

        return [campo, "<>", [primero, ultimo].map(d => d.toISOString().slice(0, 10)).join("_")];
    },
    "@semana-siguiente": (campo: string) => {
        const dia = hoy.getDay() || 7;

        const primero = new Date(hoy);
        primero.setDate(hoy.getDate() - (dia - 1) + 7);

        const ultimo = new Date(hoy);
        ultimo.setDate(hoy.getDate() + (7 - dia) + 7);

        return [campo, "<>", [primero, ultimo].map(d => d.toISOString().slice(0, 10)).join("_")];
    },
    "@este-mes": (campo: string) => {
        const primero = new Date(hoy);
        primero.setDate(1);

        const ultimo = new Date(hoy);
        ultimo.setMonth(hoy.getMonth() + 1);
        ultimo.setDate(0);

        return [campo, "<>", [primero, ultimo].map(d => d.toISOString().slice(0, 10)).join("_")];
    },
    "@mes-anterior": (campo: string) => {
        const primero = new Date(hoy);
        primero.setMonth(hoy.getMonth() - 1);
        primero.setDate(1);

        const ultimo = new Date(hoy);
        ultimo.setDate(0);

        return [campo, "<>", [primero, ultimo].map(d => d.toISOString().slice(0, 10)).join("_")];
    },
    "@mes-siguiente": (campo: string) => {
        const primero = new Date(hoy);
        primero.setMonth(hoy.getMonth() + 1);
        primero.setDate(1);

        const ultimo = new Date(hoy);
        ultimo.setMonth(hoy.getMonth() + 2);
        ultimo.setDate(0);

        return [campo, "<>", [primero, ultimo].map(d => d.toISOString().slice(0, 10)).join("_")];
    },
    "@este-año": (campo: string) => {
        const primero = new Date(hoy);
        primero.setMonth(0);
        primero.setDate(1);

        const ultimo = new Date(hoy);
        ultimo.setMonth(11);
        ultimo.setDate(31);

        return [campo, "<>", [primero, ultimo].map(d => d.toISOString().slice(0, 10)).join("_")];
    },
    "@año-anterior": (campo: string) => {
        const primero = new Date(hoy);
        primero.setFullYear(hoy.getFullYear() - 1)
        primero.setMonth(0);
        primero.setDate(1);

        const ultimo = new Date(hoy);
        ultimo.setFullYear(hoy.getFullYear() - 1)
        ultimo.setMonth(11);
        ultimo.setDate(31);

        return [campo, "<>", [primero, ultimo].map(d => d.toISOString().slice(0, 10)).join("_")];
    },
    "@año-siguiente": (campo: string) => {
        const primero = new Date(hoy);
        primero.setFullYear(hoy.getFullYear() + 1)
        primero.setMonth(0);
        primero.setDate(1);

        const ultimo = new Date(hoy);
        ultimo.setFullYear(hoy.getFullYear() + 1)
        ultimo.setMonth(11);
        ultimo.setDate(31);

        return [campo, "<>", [primero, ultimo].map(d => d.toISOString().slice(0, 10)).join("_")];
    },
}

const transformarFiltrosEspeciales = (clausula: ClausulaFiltro): ClausulaFiltro => {
    const [campo, _, valor] = clausula;

    if (!valor?.startsWith("@")) return clausula;

    const clausulaFn = filtrosEspeciales[valor as keyof typeof filtrosEspeciales];
    if (!clausulaFn) return clausula;

    return clausulaFn(campo);
}

// const transformarFiltro = (filtro: Filtro): FiltroAPI => {
//     return Object.entries(filtro).map(([campo, valor]) => [campo, '~', valor['LIKE']]);
// }

// const transformarOrden = (orden: Orden): OrdenAPI => {
//     return Object.entries(orden).map(([campo, orden]) => [campo, orden]).flat();
// }

export const obtenerOpcionesSelector =
    (path: string) => async () =>
        RestAPI.get<{ datos: [] }>(
            `/cache/comun/${path}`
        ).then((respuesta) => respuesta.datos.map(({ descripcion, ...resto }: Record<string, string>) => [Object.values(resto).at(0), descripcion] as OpcionCampo));
