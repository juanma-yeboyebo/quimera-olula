import { Criteria, ProcesarContexto } from "@olula/lib/diseño.ts";
import { accionesListaActivaEntidades, ProcesarListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { TipoCaja } from "../../diseño.js";
import { getTipoCaja, getTiposCaja } from "../../infraestructura.js";
import { ContextoMaestroTipoCaja, EstadoMaestroTipoCaja } from "./maquina.js";

/**
 * Tipo para todos los handlers del maestro
 */
type ProcesarMaestro = ProcesarContexto<EstadoMaestroTipoCaja, ContextoMaestroTipoCaja>;

/**
 * Patrón: usar accionesListaActivaEntidades para reducir código.
 * Genera automáticamente: cambiar, activar, desactivar, incluir, quitar,
 * recargar, ampliar (paginación incremental), filtrar (cambio de criteria).
 */
const conTiposCaja = (fn: ProcesarListaActivaEntidades<TipoCaja>) =>
    (ctx: ContextoMaestroTipoCaja) => ({ ...ctx, tiposCaja: fn(ctx.tiposCaja) });

export const TiposCaja = accionesListaActivaEntidades(conTiposCaja);

/**
 * Recargar lista desde API (reemplaza la lista entera)
 */
export const recargarTiposCaja: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getTiposCaja(criteria);
    return TiposCaja.recargar(contexto, resultado);
};

/**
 * Ampliar lista (paginación incremental: añade elementos a los existentes)
 * Se usa con el evento "siguiente_pagina"
 */
export const ampliarTiposCaja: ProcesarMaestro = async (contexto, payload) => {
    const criteria = payload as Criteria;
    const resultado = await getTiposCaja(criteria);
    return TiposCaja.ampliar(contexto, resultado);
};

/**
 * Incluir tipo de caja recién creado por ID (flujo con modal CrearTipoCaja)
 * El modal ya realizó el POST; aquí se obtiene la entidad completa y se incluye en la lista.
 */
export const incluirTipoCajaCreado: ProcesarMaestro = async (contexto, payload) => {
    const id = payload as string;
    const tipoCaja = await getTipoCaja(id);
    return {
        ...contexto,
        estado: "INICIAL" as EstadoMaestroTipoCaja,
        tiposCaja: {
            ...contexto.tiposCaja,
            lista: [tipoCaja, ...contexto.tiposCaja.lista],
            total: contexto.tiposCaja.total + 1,
            activo: tipoCaja.id,
        },
    };
};
