import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { useEffect } from "react";
import { Link, useParams } from "react-router";
import { ConStoreView } from "../../comun/componentes/con_storeview.tsx";
import { formatearPrecio } from "../../comun/dominio.ts";
import "../CuentaTienda.css";
import { getMaquina } from "./maquina.ts";
import { contextoPedidoInicial } from "./pedido.ts";

const ContenidoPedido = ({ idioma }: { idioma: string }) => {
    const { id } = useParams();
    const { ctx, emitir } = useMaquina(getMaquina, contextoPedidoInicial);
    const { estado, pedido } = ctx;

    useEffect(() => {
        if (id) emitir("id_cambiado", id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (estado === "CARGANDO")
        return (
            <div className="CuentaTienda">
                <div className="cuenta-contenedor">
                    <p>Cargando...</p>
                </div>
            </div>
        );

    if (estado === "NO_ENCONTRADO")
        return (
            <div className="CuentaTienda">
                <div className="cuenta-contenedor">
                    <div className="cuenta-tarjeta">
                        <p>Pedido no encontrado</p>
                        <Link to="/mi-cuenta">Volver a mi cuenta</Link>
                    </div>
                </div>
            </div>
        );

    if (estado === "ERROR" || !pedido)
        return (
            <div className="CuentaTienda">
                <div className="cuenta-contenedor">
                    <div className="cuenta-tarjeta">
                        <p role="alert" className="cuenta-error">
                            No se ha podido cargar el pedido
                        </p>
                        <Link to="/mi-cuenta">Volver a mi cuenta</Link>
                    </div>
                </div>
            </div>
        );

    const precio = (importe: number) => formatearPrecio(importe, pedido.divisa, idioma);

    return (
        <div className="CuentaTienda">
            <div className="cuenta-contenedor">
                <Link to="/mi-cuenta" className="cuenta-volver">
                    Volver a mi cuenta
                </Link>
                <h1>Pedido {pedido.codigo}</h1>
                <section className="cuenta-tarjeta">
                    <dl className="cuenta-datos">
                        <dt>Fecha</dt>
                        <dd>{pedido.fecha}</dd>
                        <dt>Estado</dt>
                        <dd>{pedido.servido}</dd>
                    </dl>
                    <table className="cuenta-tabla">
                        <thead>
                            <tr>
                                <th>Referencia</th>
                                <th>Descripción</th>
                                <th className="importe">Cantidad</th>
                                <th className="importe">Precio</th>
                                <th className="importe">Importe</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pedido.lineas.map((l, i) => (
                                <tr key={`${l.referencia}-${i}`}>
                                    <td data-etiqueta="Referencia">{l.referencia}</td>
                                    <td data-etiqueta="Descripción">{l.descripcion}</td>
                                    <td data-etiqueta="Cantidad" className="importe">{l.cantidad}</td>
                                    <td data-etiqueta="Precio" className="importe">{precio(l.precio)}</td>
                                    <td data-etiqueta="Importe" className="importe">{precio(l.importe)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <dl className="cuenta-totales">
                        <dt>Base imponible</dt>
                        <dd>{precio(pedido.neto)}</dd>
                        <dt>IVA</dt>
                        <dd>{precio(pedido.totalIva)}</dd>
                        <dt className="cuenta-total">Total</dt>
                        <dd className="cuenta-total">{precio(pedido.total)}</dd>
                    </dl>
                </section>
            </div>
        </div>
    );
};

export const DetallePedido = () => (
    <ConStoreView>{(sv) => <ContenidoPedido idioma={sv.idioma} />}</ConStoreView>
);
