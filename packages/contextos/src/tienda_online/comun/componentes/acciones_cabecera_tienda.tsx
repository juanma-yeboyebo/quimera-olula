import { QIcono } from "@olula/componentes/atomos/qicono.tsx";
import { estaAutentificado } from "@olula/componentes/plantilla/autenticacion.ts";
import { Link } from "react-router";
import { useCarritoTienda } from "../carrito_store.ts";
import { textoAriaCarrito } from "../dominio.ts";
import "./acciones_cabecera_tienda.css";

export const AccionesCabeceraTienda = () => {
    const carrito = useCarritoTienda();
    const unidades = carrito?.unidades ?? 0;
    const autentificado = estaAutentificado();

    return (
        <div className="acciones-cabecera-tienda">
            <Link
                to="/carrito"
                className="accion-cabecera-carrito"
                aria-label={textoAriaCarrito(unidades)}
                title="Carrito"
            >
                <QIcono nombre="carrito" tamaño="sm" />
                {unidades > 0 && (
                    <span className="accion-cabecera-carrito-badge">{unidades}</span>
                )}
            </Link>
            {autentificado ? (
                <Link to="/mi-cuenta">Mi cuenta</Link>
            ) : (
                <Link to="/login">Entrar</Link>
            )}
        </div>
    );
};
