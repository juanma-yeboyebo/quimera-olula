import { TipoArticuloLinea } from "#/ventas/venta/diseño.ts";
import { MetaModelo } from "@olula/lib/dominio.js";
import { metaLineaVenta } from "#/ventas/venta/dominio.ts";
import { LineaVentaTpv } from "../diseño.ts";

/**
 * Modelo de edición de línea de venta TPV.
 *
 * Tipo independiente (sin herencia) que evita el index signature
 * `[clave: string]: unknown` de Entidad, lo que permite a TypeScript
 * inferir correctamente el tipo de cada propiedad al usarlo con useModelo.
 */
export interface ModeloCambiarLinea extends LineaVentaTpv {
    tipoArticulo: TipoArticuloLinea;
}

// El Ganso nunca manda "descripcion_articulo" real desde el backend (siempre
// null en tpv_lineascomanda), así que getTipoArticulo() del genérico
// clasificaría todas las líneas como "generico" (abriría el lápiz de
// "Descripción personalizada" solo). Se arranca siempre en "registrado": el
// lápiz se abre solo si el usuario lo pide.
export const getModeloInicial = (linea: LineaVentaTpv): ModeloCambiarLinea => {
    return {
        ...linea,
        tipoArticulo: "registrado",
    };
}

export const metaLinea: MetaModelo<ModeloCambiarLinea> = {
    campos: {
        ...metaLineaVenta.campos,
        grupo_iva_producto_id: { requerido: true },
        iva_incluido: { tipo: "checkbox", requerido: false },
    },
    validacion: (m) => !!(m.referencia || m.descripcion),
};
