import { useEffect, useState } from "react";
import { BotonTienda } from "../../comun/componentes/boton_tienda.tsx";
import { ConStoreView } from "../../comun/componentes/con_storeview.tsx";
import { clavePagoEnCurso } from "../dominio.ts";
import { cerrarPago, consultarPago, ResultadoConsulta } from "./ok.ts";
import "./PagoOk.css";

const Mensaje = ({ consulta }: { consulta: ResultadoConsulta }) => {
    const { resultado, carrito } = consulta;

    if (resultado === "INCIDENCIA")
        return (
            <p>
                Pago recibido. Hemos tenido un problema al registrar el pedido y lo revisaremos;
                te contactaremos por email.
            </p>
        );
    if (resultado === "CONFIRMADO" && carrito?.estado === "CONVERTIDO")
        return (
            <>
                <h1>¡Gracias por tu compra!</h1>
                <p>Número de pedido: {String(carrito.documento?.codigo ?? "")}</p>
            </>
        );
    if (resultado === "CONFIRMADO") return <p>Pago recibido. Estamos preparando tu pedido.</p>;
    return (
        <p>
            Estamos confirmando tu pago. Si se completa, recibirás tu pedido; puedes volver a esta
            página más tarde.
        </p>
    );
};

const ContenidoOk = ({ codigo }: { codigo: string }) => {
    const [token] = useState(() => sessionStorage.getItem(clavePagoEnCurso(codigo)));
    const [consulta, setConsulta] = useState<ResultadoConsulta | null>(null);

    useEffect(() => {
        if (!token) return;
        let cancelado = false;
        consultarPago(token, { intervaloMs: 2000, maxMs: 60000, cancelado: () => cancelado }).then(
            (r) => {
                if (cancelado) return;
                if (r.resultado !== "PENDIENTE") cerrarPago(codigo);
                setConsulta(r);
            },
        );
        return () => {
            cancelado = true;
        };
    }, [token, codigo]);

    if (!token)
        return (
            <div className="PagoOk">
                <div className="pago-tarjeta">
                    <h1>No hay ningún pago en curso</h1>
                    <BotonTienda a="/catalogo">Ir al catálogo</BotonTienda>
                </div>
            </div>
        );

    return (
        <div className="PagoOk">
            <div className="pago-tarjeta">
                {consulta ? (
                    <Mensaje consulta={consulta} />
                ) : (
                    <p role="status">Comprobando tu pago…</p>
                )}
                {consulta && (
                    <BotonTienda variante="secundario" a="/catalogo">
                        Seguir comprando
                    </BotonTienda>
                )}
            </div>
        </div>
    );
};

export const PagoOk = () => (
    <ConStoreView>{(sv) => <ContenidoOk codigo={sv.codigo} />}</ConStoreView>
);
