import { useEffect, useRef, useState } from "react";
import { BotonTienda } from "../../comun/componentes/boton_tienda.tsx";
import { ConStoreView } from "../../comun/componentes/con_storeview.tsx";
import { cancelarPago } from "./cancelado.ts";
import { useSeguirComprando } from "../../comun/seguir_comprando.ts";
import "./PagoCancelado.css";

const ContenidoCancelado = ({ codigo }: { codigo: string }) => {
    const [resultado, setResultado] = useState<boolean | null>(null);
    const lanzado = useRef(false);
    const seguir = useSeguirComprando();

    useEffect(() => {
        if (lanzado.current) return;
        lanzado.current = true;
        cancelarPago(codigo).then(setResultado);
    }, [codigo]);

    if (resultado === null)
        return (
            <div className="PagoCancelado contenedor-tienda">
                <div className="pago-tarjeta">
                    <p role="status">Cancelando el pago…</p>
                </div>
            </div>
        );

    return (
        <div className="PagoCancelado contenedor-tienda">
            <div className="pago-tarjeta">
                {resultado ? (
                    <>
                        <h1>Has cancelado el pago. Tu carrito sigue disponible.</h1>
                        <BotonTienda a="/carrito">Volver al carrito</BotonTienda>
                    </>
                ) : (
                    <>
                        <h1>Has cancelado el pago.</h1>
                        <BotonTienda a={seguir.ruta}>{seguir.texto}</BotonTienda>
                    </>
                )}
            </div>
        </div>
    );
};

export const PagoCancelado = () => (
    <ConStoreView>{(sv) => <ContenidoCancelado codigo={sv.codigo} />}</ConStoreView>
);
