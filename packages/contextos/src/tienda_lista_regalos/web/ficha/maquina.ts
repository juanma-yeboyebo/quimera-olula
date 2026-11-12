import { Maquina } from "@olula/lib/diseño.ts";
import { ContextoFichaLinea, EstadoFichaLinea } from "./diseño.ts";
import { anadirAlCarrito, cambiarCantidad, cargarFicha, empezarCarritoNuevo } from "./ficha.ts";

export const getMaquina: () => Maquina<EstadoFichaLinea, ContextoFichaLinea> = () => ({
    CARGANDO: {
        linea_cambiada: [cargarFicha],
    },
    LISTO: {
        linea_cambiada: ["CARGANDO", cargarFicha],
        cantidad_cambiada: [cambiarCantidad],
        anadir_solicitado: ["AÑADIENDO", anadirAlCarrito],
    },
    AÑADIENDO: {
        linea_cambiada: ["CARGANDO", cargarFicha],
    },
    CARRITO_DE_OTRA_LISTA: {
        linea_cambiada: ["CARGANDO", cargarFicha],
        carrito_nuevo_confirmado: ["AÑADIENDO", empezarCarritoNuevo],
        carrito_nuevo_cancelado: "LISTO",
    },
    NO_ENCONTRADA: {
        linea_cambiada: ["CARGANDO", cargarFicha],
    },
    ERROR: {
        linea_cambiada: ["CARGANDO", cargarFicha],
        reintentar: ["CARGANDO", cargarFicha],
    },
});
