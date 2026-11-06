import { Maquina } from "@olula/lib/diseño.ts";
import { anadirAlCarrito, cambiarCantidad, cargarContexto } from "./detalle.ts";
import { ContextoFicha, EstadoFicha } from "./diseño.ts";

export const getMaquina: () => Maquina<EstadoFicha, ContextoFicha> = () => ({
    CARGANDO: {
        slug_cambiado: [cargarContexto],
    },
    LISTO: {
        slug_cambiado: ["CARGANDO", cargarContexto],
        cantidad_cambiada: [cambiarCantidad],
        anadir_solicitado: ["AÑADIENDO", anadirAlCarrito],
    },
    AÑADIENDO: {
        slug_cambiado: ["CARGANDO", cargarContexto],
    },
    NO_ENCONTRADO: {
        slug_cambiado: ["CARGANDO", cargarContexto],
    },
    ERROR: {
        slug_cambiado: ["CARGANDO", cargarContexto],
        reintentar: ["CARGANDO", cargarContexto],
    },
});
