import { Maquina } from "@olula/lib/diseño.js";
import { ContextoMaestroOportunidades, EstadoMaestroOportunidades } from "./diseño.ts";
import { activarOportunidad, cambiarOportunidadEnLista, desactivarOportunidadActiva, incluirOportunidadEnLista, quitarOportunidadDeLista, recargarOportunidades } from "./maestro.ts";

export const getMaquina: () => Maquina<EstadoMaestroOportunidades, ContextoMaestroOportunidades> = () => {
    return {
        INICIAL: {
            oportunidad_cambiada: cambiarOportunidadEnLista,

            oportunidad_seleccionada: activarOportunidad,

            oportunidad_deseleccionada: desactivarOportunidadActiva,

            oportunidad_borrada: quitarOportunidadDeLista,

            recarga_de_oportunidades_solicitada: recargarOportunidades,

            creacion_de_oportunidad_solicitada: "CREANDO",
        },
        CREANDO: {
            creacion_oportunidad_cancelada: "INICIAL",

            oportunidad_creada: [incluirOportunidadEnLista, activarOportunidad, "INICIAL"],
        }
    }
}
