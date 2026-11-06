import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { useEffect } from "react";
import { Link } from "react-router";
import { ConStoreView } from "../../comun/componentes/con_storeview.tsx";
import { recargarCarrito, useCarritoTienda } from "../../comun/carrito_store.ts";
import { formatearPrecio } from "../../comun/dominio.ts";
import { estaVacio, hayPagoIniciado } from "../dominio.ts";
import "./CarritoTienda.css";
import { contextoCarritoInicial } from "./detalle.ts";
import { LineasCarrito } from "./lineas/LineasCarrito.tsx";
import { getMaquina } from "./maquina.ts";

const ContenidoCarrito = ({ idioma }: { idioma: string }) => {
    const carrito = useCarritoTienda();
    const { ctx, emitir } = useMaquina(getMaquina, contextoCarritoInicial);

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
                <h1>Carrito</h1>
                {error}
                <p>Tu carrito está vacío</p>
                <Link to="/catalogo">Ir al catálogo</Link>
            </div>
        );

    return (
        <div className="CarritoTienda">
            <h1>Carrito</h1>
            {hayPagoIniciado(carrito) && (
                <p role="status" className="carrito-aviso">
                    Tienes un pago iniciado. Si modificas el carrito, tendrás que volver a pagar.
                </p>
            )}
            {error}
            <LineasCarrito
                carrito={carrito}
                idioma={idioma}
                estado={ctx.estado}
                publicar={emitir}
            />
            <dl className="carrito-totales">
                <dt>Base imponible</dt>
                <dd>{formatearPrecio(carrito.neto, carrito.divisa, idioma)}</dd>
                <dt>IVA</dt>
                <dd>{formatearPrecio(carrito.totalIva, carrito.divisa, idioma)}</dd>
                <dt>Total</dt>
                <dd className="carrito-total">
                    {formatearPrecio(carrito.total, carrito.divisa, idioma)}
                </dd>
            </dl>
            <Link to="/checkout" className="carrito-tramitar">
                Tramitar pedido
            </Link>
        </div>
    );
};

export const CarritoTienda = () => (
    <ConStoreView>{(sv) => <ContenidoCarrito idioma={sv.idioma} />}</ConStoreView>
);
