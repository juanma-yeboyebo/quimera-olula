import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { ContextoCatalogo, EstadoCatalogo, FiltrosCatalogo } from "../diseño.ts";
import { añadirPagina } from "../dominio.ts";
import { getCatalogo } from "../infraestructura.ts";

type ProcesarCatalogo = ProcesarContexto<EstadoCatalogo, ContextoCatalogo>;

const cargarPrimeraPagina = async (
    contexto: ContextoCatalogo,
    filtros: FiltrosCatalogo,
): Promise<ContextoCatalogo> => {
    try {
        const { productos, total } = await getCatalogo(filtros, 1);
        return { ...contexto, estado: "LISTO", productos, total, pagina: 1, filtros };
    } catch {
        return { ...contexto, estado: "ERROR", filtros };
    }
};

export const cargarCatalogo: ProcesarCatalogo = async (contexto) =>
    cargarPrimeraPagina(contexto, contexto.filtros);

export const filtrosCambiados: ProcesarCatalogo = async (contexto, payload) =>
    cargarPrimeraPagina(contexto, payload as FiltrosCatalogo);

export const siguientePagina: ProcesarCatalogo = async (contexto) => {
    const pagina = contexto.pagina + 1;
    try {
        const { productos, total } = await getCatalogo(contexto.filtros, pagina);
        return {
            ...contexto,
            estado: "LISTO",
            productos: añadirPagina(contexto.productos, productos),
            total,
            pagina,
        };
    } catch {
        return { ...contexto, estado: "ERROR" };
    }
};
