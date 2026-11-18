import { Maquina } from "@olula/lib/diseño.ts";
import { ContextoMaestroFormaPago, EstadoMaestroFormaPago } from "./diseño.ts";
import * as maestro from "./maestro.ts";

export const getMaquina: () => Maquina<EstadoMaestroFormaPago, ContextoMaestroFormaPago> = () => ({
    INICIAL: {
        forma_pago_seleccionada: [maestro.Formas.activar],
        forma_pago_deseleccionada: [maestro.Formas.desactivar],
        forma_pago_cambiada: [maestro.Formas.cambiar],
        website_cambiado: [maestro.cambiarWebsite, maestro.recargarFormas],
        crear_forma_pago_solicitado: "CREANDO",
    },

    CREANDO: {
        alta_de_forma_pago_cancelada: "INICIAL",
        forma_pago_creada: maestro.incluirFormaCreadaPorId,
    },
});
