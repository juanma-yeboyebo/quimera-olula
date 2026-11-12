import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { ejecutarListaProcesos } from "@olula/lib/dominio.ts";
import {
    accionesListaEntidades,
    listaEntidadesInicial,
    ProcesarListaEntidades,
} from "@olula/lib/ListaEntidades.js";
import { EdicionListaRegalos, LineaListaRegalos } from "../diseño.ts";
import { cambiosDeEdicion, hayCambios, intercambioOrden, itemDeLista, listaRegalosVacia } from "../dominio.ts";
import { getListaRegalos, patchLineaListaRegalos, patchListaRegalos } from "../infraestructura.ts";
import { ContextoDetalleListaRegalos, EstadoDetalleListaRegalos } from "./diseño.ts";

type ProcesarDetalle = ProcesarContexto<EstadoDetalleListaRegalos, ContextoDetalleListaRegalos>;

const pipeLista = ejecutarListaProcesos<EstadoDetalleListaRegalos, ContextoDetalleListaRegalos>;

const conLineas = (fn: ProcesarListaEntidades<LineaListaRegalos>) =>
    (ctx: ContextoDetalleListaRegalos) => ({ ...ctx, lineas: fn(ctx.lineas) });

export const Lineas = accionesListaEntidades(conLineas);

export const contextoDetalleListaRegalosInicial: ContextoDetalleListaRegalos = {
    estado: "INICIAL",
    lista: listaRegalosVacia(),
    lineas: listaEntidadesInicial<LineaListaRegalos>(),
};

export const refrescarLista: ProcesarDetalle = async (contexto) => {
    const lista = await getListaRegalos(contexto.lista.id);
    const activo = contexto.lineas.activo
        ? lista.lineas.find((l) => l.id === contexto.lineas.activo?.id) ?? null
        : null;
    return [
        {
            ...contexto,
            lista,
            lineas: {
                lista: lista.lineas,
                total: lista.lineas.length,
                activo,
            },
        },
        [["lista_cambiada", itemDeLista(lista)]],
    ];
};

export const guardarDatos = async (
    contexto: ContextoDetalleListaRegalos,
    edicion: EdicionListaRegalos,
): Promise<boolean> => {
    const cambios = cambiosDeEdicion(contexto.lista, edicion);
    if (!hayCambios(cambios)) return false;
    await patchListaRegalos(contexto.lista.id, cambios);
    return true;
};

const activarLineaPorId = (id: string) => async (contexto: ContextoDetalleListaRegalos) => ({
    ...contexto,
    lineas: { ...contexto.lineas, activo: contexto.lineas.lista.find((l) => l.id === id) ?? null },
});

const desactivarLinea = async (contexto: ContextoDetalleListaRegalos) => ({
    ...contexto,
    lineas: { ...contexto.lineas, activo: null },
});

export const onLineaCreada: ProcesarDetalle = async (contexto, payload) =>
    pipeLista(contexto, [refrescarLista, activarLineaPorId(payload as string)]);

export const onLineaCambiada: ProcesarDetalle = async (contexto, payload) =>
    pipeLista(contexto, [refrescarLista, activarLineaPorId((payload as LineaListaRegalos).id)]);

export const onLineaBorrada: ProcesarDetalle = async (contexto) =>
    pipeLista(contexto, [refrescarLista, desactivarLinea]);

const moverLinea = (delta: -1 | 1): ProcesarDetalle => async (contexto, payload) => {
    const cambio = intercambioOrden(contexto.lineas.lista, payload as string, delta);
    if (!cambio) return contexto;
    const [primera, segunda] = cambio;
    await patchLineaListaRegalos(contexto.lista.id, primera.id, { orden: primera.orden });
    await patchLineaListaRegalos(contexto.lista.id, segunda.id, { orden: segunda.orden });
    return refrescarLista(contexto);
};

export const subirLinea: ProcesarDetalle = moverLinea(-1);

export const bajarLinea: ProcesarDetalle = moverLinea(1);

const cargarLista: (_: string) => ProcesarDetalle = (id) => async (contexto) => {
    const lista = await getListaRegalos(id);
    return pipeLista(contexto, [
        async (ctx) => ({
            ...ctx,
            lista,
            lineas: { lista: lista.lineas, total: lista.lineas.length, activo: null },
        }),
        "ABIERTO",
    ]);
};

export const cargarContexto: ProcesarDetalle = async (contexto, payload) => {
    const id = payload as string;
    if (id) return cargarLista(id)(contexto);
    return {
        ...contexto,
        estado: "INICIAL",
        lista: listaRegalosVacia(),
        lineas: listaEntidadesInicial<LineaListaRegalos>(),
    };
};
