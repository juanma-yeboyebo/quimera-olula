import { Maquina } from "@olula/lib/diseño.js";
import { ContextoMaestroEstadosOportunidad, EstadoMaestroEstadosOportunidad } from "./diseño.ts";
import { EstadosOportunidad, recargarEstadosOportunidad } from "./maestro.ts";

export const getMaquina: () => Maquina<EstadoMaestroEstadosOportunidad, ContextoMaestroEstadosOportunidad> = () => {
    return {
        INICIAL: {
            estado_oportunidad_cambiado: [EstadosOportunidad.cambiar],

            estado_oportunidad_seleccionado: [EstadosOportunidad.activar],

            estado_oportunidad_deseleccionado: EstadosOportunidad.desactivar,

            estado_oportunidad_marcado_defecto: (ctx) => recargarEstadosOportunidad(ctx, ctx.estados_oportunidad.criteria),

            estado_oportunidad_borrado: EstadosOportunidad.quitar,

            recarga_de_estados_oportunidad_solicitada: recargarEstadosOportunidad,

            criteria_cambiado: [EstadosOportunidad.filtrar, recargarEstadosOportunidad],

            creacion_de_estado_oportunidad_solicitada: "CREANDO",
        },
        CREANDO: {
            creacion_estado_oportunidad_cancelada: "INICIAL",

            estado_oportunidad_creado: [EstadosOportunidad.incluir, EstadosOportunidad.activar, "INICIAL"],
        }
    }
}
