import { Maquina } from "@olula/lib/diseño.ts";
import { ContextoNavegador, EstadoNavegador } from "./diseño.ts";
import {
    alternarMedidasEnColumnas,
    alternarNodo,
    cambiarCubo,
    cambiarPeticion,
    cargarCatalogo,
    exportar,
} from "./navegador.ts";

export const getMaquina: () => Maquina<EstadoNavegador, ContextoNavegador> = () => ({
    CARGANDO: {
        iniciado: [cargarCatalogo],
    },

    SIN_CUBOS: {},

    NAVEGANDO: {
        cubo_cambiado: [cambiarCubo],
        peticion_cambiada: [cambiarPeticion],
        medidas_en_columnas_alternado: [alternarMedidasEnColumnas],
        nodo_alternado: [alternarNodo],
        exportacion_solicitada: [exportar],
    },
});
