import { CarritoTienda } from "./carrito/detalle/CarritoTienda.tsx";
import { CatalogoTienda } from "./catalogo/maestro/CatalogoTienda.tsx";
import { PagoCancelado } from "./checkout/cancelado/PagoCancelado.tsx";
import { CheckoutTienda } from "./checkout/detalle/CheckoutTienda.tsx";
import { PagoOk } from "./checkout/ok/PagoOk.tsx";
import { PaginaEstilos } from "./comun/estilos/PaginaEstilos.tsx";
import { InicioTienda } from "./inicio/InicioTienda.tsx";
import { FichaProducto } from "./producto/detalle/FichaProducto.tsx";

export class RouterFactoryTiendaOnline {
    static router = {
        "": InicioTienda,
        "catalogo": CatalogoTienda,
        "categoria/:slug": CatalogoTienda,
        "producto/:slug": FichaProducto,
        "carrito": CarritoTienda,
        "checkout": CheckoutTienda,
        "checkout/ok": PagoOk,
        "checkout/cancelado": PagoCancelado,
        ...(import.meta.env.DEV ? { "estilos": PaginaEstilos } : {}),
    }
}
