import { descargarDocumento } from "@olula/lib/api/documentos.ts";
import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { Cubo, Miembro, PeticionPivot } from "../../diseño.ts";
import {
    alternarNodo as alternarNodoArbol,
    arbolDesdePivot,
    expandirNodo,
    necesitaCargar,
    nombreExportacion,
    peticionInicial,
    peticionNodo,
} from "../../dominio.ts";
import { exportarPivot, getCatalogo, postPivot } from "../../infraestructura.ts";
import { ContextoNavegador, EstadoNavegador } from "./diseño.ts";

type ProcesarNavegador = ProcesarContexto<EstadoNavegador, ContextoNavegador>;

export const contextoNavegadorInicial: ContextoNavegador = {
    estado: "CARGANDO",
    cubos: [],
    cubo: null,
    peticion: null,
    medidasEnColumnas: true,
    arbol: null,
    truncado: false,
};

const consultar = async (ctx: ContextoNavegador, cubo: Cubo, peticion: PeticionPivot): Promise<ContextoNavegador> => {
    const resultado = await postPivot(cubo.id, peticionNodo(peticion, []));
    return {
        ...ctx,
        estado: "NAVEGANDO",
        cubo,
        peticion,
        arbol: arbolDesdePivot(resultado.filas),
        truncado: resultado.truncado,
    };
};

export const cargarCatalogo: ProcesarNavegador = async (ctx) => {
    const cubos = await getCatalogo();
    if (cubos.length === 0) return { ...ctx, estado: "SIN_CUBOS", cubos };
    return consultar({ ...ctx, cubos }, cubos[0], peticionInicial(cubos[0]));
};

export const cambiarCubo: ProcesarNavegador = async (ctx, payload) => {
    const cubo = ctx.cubos.find((c) => c.id === payload);
    if (!cubo || cubo.id === ctx.cubo?.id) return ctx;
    return consultar(ctx, cubo, peticionInicial(cubo));
};

export const cambiarPeticion: ProcesarNavegador = async (ctx, payload) =>
    ctx.cubo ? consultar(ctx, ctx.cubo, payload as PeticionPivot) : ctx;

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
        arbol: expandirNodo(arbol, ruta, resultado.filas),
        truncado: ctx.truncado || resultado.truncado,
    };
};

export const exportar: ProcesarNavegador = async (ctx) => {
    if (!ctx.cubo || !ctx.peticion) return ctx;
    const fichero = await exportarPivot(ctx.cubo.id, ctx.peticion);
    await descargarDocumento(fichero, nombreExportacion(ctx.cubo.id, new Date()));
    return ctx;
};
