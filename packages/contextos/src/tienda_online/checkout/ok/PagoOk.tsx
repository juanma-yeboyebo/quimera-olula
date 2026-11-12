import { useEffect, useState } from "react";
import { BotonTienda } from "../../comun/componentes/boton_tienda.tsx";
import { ConStoreView } from "../../comun/componentes/con_storeview.tsx";
import { FormaPagoTienda } from "../../comun/diseño.ts";
import { clavePagoEnCurso } from "../dominio.ts";
import { cerrarPago, consultarPago, ResultadoConsulta } from "./ok.ts";
import { useSeguirComprando } from "../../comun/seguir_comprando.ts";
import "./PagoOk.css";

const MensajePedido = ({
    consulta,
    formasPago,
}: {
    consulta: ResultadoConsulta;
    formasPago: FormaPagoTienda[];
}) => {
    const { resultado, carrito } = consulta;
    const descripcion = formasPago.find((f) => f.id === carrito?.formaPago?.id)?.descripcion;

    return (
        <>
            {resultado === "INCIDENCIA" ? (
                <p>
                    Hemos recibido tu pedido, pero hemos tenido un problema al registrarlo. Lo
                    revisaremos y te contactaremos por email.
                </p>
            ) : carrito?.estado === "CONVERTIDO" ? (
                <>
                    <h1>¡Gracias por tu pedido!</h1>
                    <p>Número de pedido: {String(carrito.documento?.codigo ?? "")}</p>
                </>
            ) : (
                <p>Pedido recibido. Lo estamos preparando.</p>
            )}
            {descripcion && <p>{descripcion}</p>}
        </>
    );
};

const Mensaje = ({
    consulta,
    formasPago,
}: {
    consulta: ResultadoConsulta;
    formasPago: FormaPagoTienda[];
}) => {
    const { resultado, carrito } = consulta;

    if (resultado !== "PENDIENTE" && carrito?.formaPago?.tipo === "SIN_PASARELA")
        return <MensajePedido consulta={consulta} formasPago={formasPago} />;
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

const ContenidoOk = ({
    codigo,
    formasPago,
}: {
    codigo: string;
    formasPago: FormaPagoTienda[];
}) => {
    const [token] = useState(() => sessionStorage.getItem(clavePagoEnCurso(codigo)));
    const [consulta, setConsulta] = useState<ResultadoConsulta | null>(null);
    const seguir = useSeguirComprando();

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
            <div className="PagoOk contenedor-tienda">
                <div className="pago-tarjeta">
                    <h1>No hay ningún pago en curso</h1>
                    <BotonTienda a={seguir.ruta}>{seguir.texto}</BotonTienda>
                </div>
            </div>
        );

    return (
        <div className="PagoOk contenedor-tienda">
            <div className="pago-tarjeta">
                {consulta ? (
                    <Mensaje consulta={consulta} formasPago={formasPago} />
                ) : (
                    <p role="status">Comprobando tu pago…</p>
                )}
                {consulta && (
                    <BotonTienda variante="secundario" a={seguir.ruta}>
                        Seguir comprando
                    </BotonTienda>
                )}
            </div>
        </div>
    );
};

export const PagoOk = () => (
    <ConStoreView>
        {(sv) => <ContenidoOk codigo={sv.codigo} formasPago={sv.formasPago} />}
    </ConStoreView>
);
