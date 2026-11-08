import { useEffect } from "react";
import { recargarCarrito, useCarritoTienda } from "../../comun/carrito_store.ts";
import { BotonTienda } from "../../comun/componentes/boton_tienda.tsx";
import { ConStoreView } from "../../comun/componentes/con_storeview.tsx";
import { PrecioTienda } from "../../comun/componentes/precio_tienda.tsx";
import { estaVacio, hayPagoIniciado } from "../dominio.ts";
import { EnvioGratis } from "../envio_gratis/EnvioGratis.tsx";
import "./CarritoTienda.css";
import { LineasCarrito } from "./lineas/LineasCarrito.tsx";
import { useEdicionCarrito } from "./usar_edicion_carrito.ts";

const ContenidoCarrito = () => {
    const carrito = useCarritoTienda();
    const { ctx, publicar, bloqueado } = useEdicionCarrito();

    useEffect(() => {
        recargarCarrito().catch(() => undefined);
    }, []);

    const error = ctx.error && (
        <p role="alert" className="carrito-error">
            {ctx.error}
        </p>
    );

    if (!carrito || estaVacio(carrito))
        return (
            <div className="CarritoTienda">
                <div className="carrito-contenedor contenedor-tienda">
                    <h1>Carrito</h1>
                    {error}
                    <p>Tu carrito está vacío</p>
                    <BotonTienda a="/catalogo">Ir al catálogo</BotonTienda>
                </div>
            </div>
        );

    return (
        <div className="CarritoTienda">
            <div className="carrito-contenedor contenedor-tienda">
                <h1>Carrito</h1>
                {hayPagoIniciado(carrito) && (
                    <p role="status" className="carrito-aviso">
                        Tienes un pago iniciado. Si modificas el carrito, tendrás que volver a pagar.
                    </p>
                )}
                {error}
                <div className="carrito-rejilla">
                    <div className="carrito-principal">
                        <EnvioGratis total={carrito.total} divisa={carrito.divisa} />
                        <LineasCarrito
                            carrito={carrito}
                            estado={ctx.estado}
                            ocupado={bloqueado}
                            publicar={publicar}
                        />
                    </div>
                    <aside className="carrito-resumen">
                        <dl className="carrito-totales">
                            <dt>Base imponible</dt>
                            <dd>
                                <PrecioTienda importe={carrito.neto} divisa={carrito.divisa} />
                            </dd>
                            <dt>IVA</dt>
                            <dd>
                                <PrecioTienda importe={carrito.totalIva} divisa={carrito.divisa} />
                            </dd>
                            <dt>Total</dt>
                            <dd>
                                <PrecioTienda importe={carrito.total} divisa={carrito.divisa} grande />
                            </dd>
                        </dl>
                        <BotonTienda a="/checkout" ancho>
                            Tramitar pedido
                        </BotonTienda>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export const CarritoTienda = () => <ConStoreView>{() => <ContenidoCarrito />}</ConStoreView>;
