import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { getListaRegalos } from "../infraestructura.ts";
import { ContextoListaRegalos, EstadoListaRegalos } from "./diseño.ts";

type ProcesarLista = ProcesarContexto<EstadoListaRegalos, ContextoListaRegalos>;

export const contextoListaInicial: ContextoListaRegalos = {
    estado: "CARGANDO",
    token: null,
    lista: null,
};

const estadoDe = (e: unknown): number | undefined => (e as { estado?: number })?.estado;

export const cargarLista: ProcesarLista = async (contexto, payload) => {
    const token = (payload as string | undefined) ?? contexto.token ?? "";
    try {
        const lista = await getListaRegalos(token);
        return { ...contextoListaInicial, estado: "LISTO", token, lista };
    } catch (e) {
        return {
            ...contextoListaInicial,
            estado: estadoDe(e) === 404 ? "NO_ENCONTRADA" : "ERROR",
            token,
        };
    }
};
