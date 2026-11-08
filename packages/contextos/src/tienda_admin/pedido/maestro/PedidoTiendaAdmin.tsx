import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import "./PedidoTiendaAdmin.css";

export const TITULO_PEDIDOS_TIENDA = "Pedidos de la tienda";
export const TEXTO_PEDIDOS_PROXIMAMENTE =
    "Próximamente: los pedidos de la tienda filtrados desde Ventas → Pedidos";
export const RUTA_PEDIDOS_VENTAS = "/ventas/pedido";

export const PedidoTiendaAdmin = () => (
    <div className="PedidoTiendaAdmin">
        <h2>{TITULO_PEDIDOS_TIENDA}</h2>
        <p>{TEXTO_PEDIDOS_PROXIMAMENTE}</p>
        <div className="maestro-botones">
            <QBoton variante="borde" enlace={RUTA_PEDIDOS_VENTAS}>
                Ir a Pedidos de ventas
            </QBoton>
        </div>
    </div>
);
