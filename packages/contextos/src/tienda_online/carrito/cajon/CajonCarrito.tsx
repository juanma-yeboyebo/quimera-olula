import { QIcono } from "@olula/componentes/atomos/qicono.tsx";
import { useEffect, useRef } from "react";
import { cerrarCajonCarrito, useCajonCarrito } from "../../comun/cajon_carrito_store.ts";
import { useCarritoTienda } from "../../comun/carrito_store.ts";
import { BotonTienda } from "../../comun/componentes/boton_tienda.tsx";
import { PrecioTienda } from "../../comun/componentes/precio_tienda.tsx";
import { LineasCarrito } from "../detalle/lineas/LineasCarrito.tsx";
import { useEdicionCarrito } from "../detalle/usar_edicion_carrito.ts";
import { estaVacio, hayPagoIniciado } from "../dominio.ts";
import { EnvioGratis } from "../envio_gratis/EnvioGratis.tsx";
import "./CajonCarrito.css";

export const CajonCarrito = () => {
    const abierto = useCajonCarrito();
    const carrito = useCarritoTienda();
    const { ctx, publicar, bloqueado } = useEdicionCarrito();
    const cajon = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!abierto) return;
        cajon.current?.focus();
        const anterior = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const alTeclear = (e: KeyboardEvent) => {
            if (e.key === "Escape") cerrarCajonCarrito();
        };
        document.addEventListener("keydown", alTeclear);
        return () => {
            document.body.style.overflow = anterior;
            document.removeEventListener("keydown", alTeclear);
        };
    }, [abierto]);

    const vacio = !carrito || estaVacio(carrito);

    return (
        <>
            <div
                className="cajon-carrito-velo"
                data-abierto={abierto}
                onClick={cerrarCajonCarrito}
                aria-hidden="true"
            />
            <aside
                className="cajon-carrito"
                data-abierto={abierto}
                ref={cajon}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-label="Carrito"
                aria-hidden={!abierto}
            >
                <div className="cajon-carrito-cabecera">
                    <strong>Tu carrito ({carrito?.unidades ?? 0})</strong>
                    <button type="button" aria-label="Cerrar carrito" onClick={cerrarCajonCarrito}>
                        <QIcono nombre="cerrar" tamaño="md" />
                    </button>
                </div>
                {vacio ? (
                    <div className="cajon-carrito-vacio">
                        <p>Tu carrito está vacío.</p>
                        <BotonTienda a="/catalogo" onClick={cerrarCajonCarrito}>
                            Ver la colección
                        </BotonTienda>
                    </div>
                ) : (
                    <>
                        <div className="cajon-carrito-cuerpo">
                            {hayPagoIniciado(carrito) && (
                                <p role="status" className="cajon-carrito-aviso">
                                    Tienes un pago iniciado. Si modificas el carrito, tendrás que volver a pagar.
                                </p>
                            )}
                            {ctx.error && (
                                <p role="alert" className="cajon-carrito-error">
                                    {ctx.error}
                                </p>
                            )}
                            <EnvioGratis total={carrito.total} divisa={carrito.divisa} />
                            <LineasCarrito
                                carrito={carrito}
                                estado={ctx.estado}
                                ocupado={bloqueado}
                                publicar={publicar}
                            />
                        </div>
                        <div className="cajon-carrito-pie">
                            <div className="cajon-carrito-total">
                                <span>Total</span>
                                <PrecioTienda importe={carrito.total} divisa={carrito.divisa} grande />
                            </div>
                            <small>IVA incluido.</small>
                            <BotonTienda a="/checkout" ancho>
                                Finalizar compra
                            </BotonTienda>
                            <BotonTienda variante="enlace" onClick={cerrarCajonCarrito}>
                                Seguir comprando
                            </BotonTienda>
                        </div>
                    </>
                )}
            </aside>
        </>
    );
};
