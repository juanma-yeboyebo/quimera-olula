import type { ComponentType } from "react";
import type { ProductoCatalogo } from "./catalogo/diseño.ts";
import type { FichaProducto } from "./producto/diseño.ts";

export class FactoryTiendaOnline {
    static tarjeta_producto_acciones: ComponentType<{ producto: ProductoCatalogo }> | null = null;
    static ficha_acciones: ComponentType<{ ficha: FichaProducto }> | null = null;
}
