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

    if (estado === "CARGANDO") return <p>Cargando...</p>;

    if (estado === "NO_ENCONTRADO")
        return (
            <div className="CuentaTienda">
                <p>Pedido no encontrado</p>
                <Link to="/mi-cuenta">Volver a mi cuenta</Link>
            </div>
        );

    if (estado === "ERROR" || !pedido)
        return (
            <div className="CuentaTienda">
                <p role="alert" className="cuenta-error">
                    No se ha podido cargar el pedido
                </p>
                <Link to="/mi-cuenta">Volver a mi cuenta</Link>
            </div>
        );

    const precio = (importe: number) => formatearPrecio(importe, pedido.divisa, idioma);

    return (
        <div className="CuentaTienda">
            <h1>Pedido {pedido.codigo}</h1>
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
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Importe</th>
                    </tr>
                </thead>
                <tbody>
                    {pedido.lineas.map((l, i) => (
                        <tr key={`${l.referencia}-${i}`}>
                            <td>{l.referencia}</td>
                            <td>{l.descripcion}</td>
                            <td>{l.cantidad}</td>
                            <td>{precio(l.precio)}</td>
                            <td>{precio(l.importe)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <dl className="cuenta-totales">
                <dt>Base imponible</dt>
                <dd>{precio(pedido.neto)}</dd>
                <dt>IVA</dt>
                <dd>{precio(pedido.totalIva)}</dd>
                <dt>Total</dt>
                <dd className="cuenta-total">{precio(pedido.total)}</dd>
            </dl>
            <Link to="/mi-cuenta">Volver a mi cuenta</Link>
        </div>
    );
};

export const DetallePedido = () => (
    <ConStoreView>{(sv) => <ContenidoPedido idioma={sv.idioma} />}</ConStoreView>
);
