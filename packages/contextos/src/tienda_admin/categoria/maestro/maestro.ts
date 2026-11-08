import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { OperacionArbol } from "../diseño.ts";
import { buscarNodo, moverEntreHermanas, resolverSoltado } from "../dominio.ts";
import { getArbolCategorias, patchMoverCategoria, patchOrdenarCategorias } from "../infraestructura.ts";
import { ContextoMaestroCategoria, EstadoMaestroCategoria, PayloadSoltado } from "./diseño.ts";

type ProcesarMaestro = ProcesarContexto<EstadoMaestroCategoria, ContextoMaestroCategoria>;

export const contextoMaestroCategoriaInicial: ContextoMaestroCategoria = {
    estado: "INICIAL",
    websiteId: null,
    arbol: [],
    activa: undefined,
    padreAlta: null,
    moviendo: null,
};

export const cambiarWebsite: ProcesarMaestro = async (contexto, payload) => ({
    ...contexto,
    websiteId: payload as number,
    activa: undefined,
});

export const recargarArbol: ProcesarMaestro = async (contexto) => {
    if (contexto.websiteId === null) return contexto;
    const arbol = await getArbolCategorias(contexto.websiteId);
    const activa =
        contexto.activa !== undefined && buscarNodo(arbol, contexto.activa) ? contexto.activa : undefined;
    return { ...contexto, arbol, activa };
};

export const seleccionarCategoria: ProcesarMaestro = async (contexto, payload) => ({
    ...contexto,
    activa: payload as string,
});

export const deseleccionarCategoria: ProcesarMaestro = async (contexto) => ({
    ...contexto,
    activa: undefined,
});

export const aplicarOperacion = async (
    contexto: ContextoMaestroCategoria,
    operacion: OperacionArbol | null,
): Promise<ContextoMaestroCategoria> => {
    if (!operacion || contexto.websiteId === null) return contexto;
    if (operacion.tipo === "ordenar") {
        await patchOrdenarCategorias(contexto.websiteId, operacion.padreId, operacion.ids);
    } else {
        await patchMoverCategoria(operacion.id, operacion.padreId);
    }
    return contexto;
};

export const subirCategoria: ProcesarMaestro = async (contexto, payload) =>
    aplicarOperacion(contexto, moverEntreHermanas(contexto.arbol, payload as string, -1));

export const bajarCategoria: ProcesarMaestro = async (contexto, payload) =>
    aplicarOperacion(contexto, moverEntreHermanas(contexto.arbol, payload as string, 1));

export const soltarCategoria: ProcesarMaestro = async (contexto, payload) => {
    const { origenId, destinoId, posicion } = payload as PayloadSoltado;
    return aplicarOperacion(contexto, resolverSoltado(contexto.arbol, origenId, destinoId, posicion));
};

export const iniciarAlta: ProcesarMaestro = async (contexto, payload) => ({
    ...contexto,
    estado: "CREANDO",
    padreAlta: (payload as string | null | undefined) ?? null,
});

export const iniciarMovimiento: ProcesarMaestro = async (contexto, payload) => ({
    ...contexto,
    estado: "MOVIENDO",
    moviendo: payload as string,
});

export const confirmarMovimiento: ProcesarMaestro = async (contexto, payload) => {
    const padreId = (payload as string | null) || null;
    const resultado = await aplicarOperacion(
        contexto,
        contexto.moviendo === null ? null : { tipo: "mover", id: contexto.moviendo, padreId },
    );
    return { ...resultado, estado: "INICIAL", moviendo: null };
};

export const categoriaCreada: ProcesarMaestro = async (contexto, payload) => ({
    ...contexto,
    estado: "INICIAL",
    padreAlta: null,
    activa: payload as string,
});
