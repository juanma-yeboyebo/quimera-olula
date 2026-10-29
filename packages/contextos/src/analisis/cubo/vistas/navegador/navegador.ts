import { descargarDocumento } from "@olula/lib/api/documentos.ts";
import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { preferencias } from "@olula/lib/preferencias.ts";
import { Cubo, Miembro, PeticionPivot } from "../../diseño.ts";
import {
    alternarNodo as alternarNodoArbol,
    apilar,
    arbolDesdePivot,
    etiquetarMeses,
    expandirNodo,
    historialNuevo,
    moverHistorial,
    necesitaCargar,
    nombreExportacion,
    peticionInicial,
    peticionNodo,
} from "../../dominio.ts";
import { exportarPivot, getCatalogo, postPivot } from "../../infraestructura.ts";
import { ContextoNavegador, EstadoNavegador } from "./diseño.ts";

type ProcesarNavegador = ProcesarContexto<EstadoNavegador, ContextoNavegador>;

const PREFERENCIA_CUBO = "analisis.cubo";

export const contextoNavegadorInicial: ContextoNavegador = {
    estado: "CARGANDO",
    cubos: [],
    cubo: null,
    peticion: null,
    medidasEnColumnas: true,
    arbol: null,
    truncado: false,
    historial: null,
};

const consultar = async (ctx: ContextoNavegador, cubo: Cubo, peticion: PeticionPivot): Promise<ContextoNavegador> => {
    const resultado = await postPivot(cubo.id, peticionNodo(peticion, []));
    return {
        ...ctx,
        estado: "NAVEGANDO",
        cubo,
        peticion,
        arbol: arbolDesdePivot(etiquetarMeses(cubo, peticion, resultado.filas)),
        truncado: resultado.truncado,
    };
};

export const cargarCatalogo: ProcesarNavegador = async (ctx) => {
    const cubos = await getCatalogo();
    if (cubos.length === 0) return { ...ctx, estado: "SIN_CUBOS", cubos };
    const preferido = preferencias.get<string | null>(PREFERENCIA_CUBO, null);
    const cubo = cubos.find((c) => c.id === preferido) ?? cubos[0];
    const peticion = peticionInicial(cubo);
    return consultar({ ...ctx, cubos, historial: historialNuevo(peticion) }, cubo, peticion);
};

export const cambiarCubo: ProcesarNavegador = async (ctx, payload) => {
    const cubo = ctx.cubos.find((c) => c.id === payload);
    if (!cubo || cubo.id === ctx.cubo?.id) return ctx;
    preferencias.set(PREFERENCIA_CUBO, cubo.id);
    const peticion = peticionInicial(cubo);
    return consultar({ ...ctx, historial: historialNuevo(peticion) }, cubo, peticion);
};

export const cambiarPeticion: ProcesarNavegador = async (ctx, payload) => {
    const peticion = payload as PeticionPivot;
    if (!ctx.cubo || !ctx.historial) return ctx;
    return consultar({ ...ctx, historial: apilar(ctx.historial, peticion) }, ctx.cubo, peticion);
};

const recorrerHistorial = (paso: -1 | 1): ProcesarNavegador => async (ctx) => {
    if (!ctx.cubo || !ctx.historial) return ctx;
    const historial = moverHistorial(ctx.historial, paso);
    if (historial === ctx.historial) return ctx;
    return consultar({ ...ctx, historial }, ctx.cubo, historial.peticiones[historial.posicion]);
};

export const irAtras = recorrerHistorial(-1);

export const irAdelante = recorrerHistorial(1);

export const alternarMedidasEnColumnas: ProcesarNavegador = async (ctx) => ({
    ...ctx,
    medidasEnColumnas: !ctx.medidasEnColumnas,
});

export const alternarNodo: ProcesarNavegador = async (ctx, payload) => {
    const ruta = payload as Miembro[];
    const { cubo, peticion, arbol } = ctx;
    if (!cubo || !peticion || !arbol) return ctx;
    if (!necesitaCargar(arbol, ruta)) return { ...ctx, arbol: alternarNodoArbol(arbol, ruta) };
    const resultado = await postPivot(cubo.id, peticionNodo(peticion, ruta));
    return {
        ...ctx,
        arbol: expandirNodo(arbol, ruta, etiquetarMeses(cubo, peticion, resultado.filas)),
        truncado: ctx.truncado || resultado.truncado,
    };
};

export const exportar: ProcesarNavegador = async (ctx) => {
    if (!ctx.cubo || !ctx.peticion) return ctx;
    const fichero = await exportarPivot(ctx.cubo.id, ctx.peticion);
    await descargarDocumento(fichero, nombreExportacion(ctx.cubo.id, new Date()));
    return ctx;
};
