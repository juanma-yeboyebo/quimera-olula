import { ClausulaFiltro, Filtro, Paginacion } from "@olula/lib/diseño.ts";
import { Articulo } from "./diseño.ts";

export const articuloVacio = (): Articulo => ({
    id: "",
    descripcion: "",
    codbarras: "",
    tipoCodBarras: "",
    observaciones: "",
    precio: 0,
    grupoIvaProductoId: "",
    pvpVariable: false,
    noStock: false,
});

export const CAMPO_INCLUIR_NO_VENDIBLES = "incluir_no_vendibles";

const clausulasAmbosSeVende: Filtro = {
    or: [
        ["se_vende", "=", "true"],
        ["se_vende", "=", "false"],
    ],
};

const esListaClausulas = (filtro: Filtro): filtro is ClausulaFiltro[] =>
    Array.isArray(filtro) && (filtro.length === 0 || Array.isArray(filtro[0]));

export const filtroArticulosVenta = (filtro: Filtro): Filtro => {
    if (!esListaClausulas(filtro)) return filtro;

    const incluirNoVendibles = filtro.some(
        ([campo, , valor]) => campo === CAMPO_INCLUIR_NO_VENDIBLES && valor === "true"
    );
    const resto = filtro.filter(([campo]) => campo !== CAMPO_INCLUIR_NO_VENDIBLES);

    if (!incluirNoVendibles) return resto;

    return resto.length ? { and: [clausulasAmbosSeVende, resto] } : clausulasAmbosSeVende;
};

export const totalEstimado = (paginacion: Paginacion, recibidos: number): number => {
    const anteriores = (paginacion.pagina - 1) * paginacion.limite;
    const hayMas = recibidos === paginacion.limite ? 1 : 0;

    return anteriores + recibidos + hayMas;
};
