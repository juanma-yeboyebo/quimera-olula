import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { accionesListaActivaEntidades, ProcesarListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.js";
import { FormaPagoTienda } from "../diseño.ts";
import { getFormaPago, getFormasPago } from "../infraestructura.ts";
import { ContextoMaestroFormaPago, EstadoMaestroFormaPago } from "./diseño.ts";

type ProcesarMaestro = ProcesarContexto<EstadoMaestroFormaPago, ContextoMaestroFormaPago>;

const conFormas = (fn: ProcesarListaActivaEntidades<FormaPagoTienda>) =>
    (ctx: ContextoMaestroFormaPago) => ({ ...ctx, formas: fn(ctx.formas) });

export const Formas = accionesListaActivaEntidades(conFormas);

export const cambiarWebsite: ProcesarMaestro = async (contexto, payload) => ({
    ...contexto,
    websiteId: payload as number,
    formas: { ...contexto.formas, activo: undefined },
});

export const recargarFormas: ProcesarMaestro = async (contexto) => {
    if (contexto.websiteId === null) return contexto;
    const lista = await getFormasPago(contexto.websiteId);
    return Formas.recargar(contexto, { datos: lista, total: lista.length });
};

export const incluirFormaCreadaPorId: ProcesarMaestro = async (contexto, payload) => {
    const forma = await getFormaPago(payload as string);
    return {
        ...contexto,
        estado: "INICIAL",
        formas: {
            ...contexto.formas,
            lista: [...contexto.formas.lista, forma],
            total: contexto.formas.total + 1,
            activo: forma.id,
        },
    };
};
