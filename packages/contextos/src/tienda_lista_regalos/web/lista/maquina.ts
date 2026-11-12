import { Maquina } from "@olula/lib/diseño.ts";
import { ContextoListaRegalos, EstadoListaRegalos } from "./diseño.ts";
import { cargarLista } from "./lista.ts";

export const getMaquina: () => Maquina<EstadoListaRegalos, ContextoListaRegalos> = () => ({
    CARGANDO: {
        token_cambiado: [cargarLista],
    },
    LISTO: {
        token_cambiado: ["CARGANDO", cargarLista],
    },
    NO_ENCONTRADA: {
        token_cambiado: ["CARGANDO", cargarLista],
    },
    ERROR: {
        token_cambiado: ["CARGANDO", cargarLista],
        reintentar: ["CARGANDO", cargarLista],
    },
});
