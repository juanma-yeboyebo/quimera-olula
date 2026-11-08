import { estaAutentificado } from "@olula/componentes/plantilla/autenticacion.ts";
import { Link } from "react-router";
import { useCarritoTienda } from "../carrito_store.ts";
import { textoAriaCarrito } from "../dominio.ts";
import { BotonIcono } from "./boton_icono.tsx";
import "./acciones_cabecera_tienda.css";

export const AccionesCabeceraTienda = () => {
    const carrito = useCarritoTienda();
    const unidades = carrito?.unidades ?? 0;
    const autentificado = estaAutentificado();

    return (
        <div className="acciones-cabecera-tienda">
            {autentificado ? (
                <Link to="/mi-cuenta">Mi cuenta</Link>
            ) : (
                <Link to="/login">Entrar</Link>
            )}
            <BotonIcono
                icono="carrito"
                etiqueta={textoAriaCarrito(unidades)}
                contador={unidades}
                a="/carrito"
            />
        </div>
    );
};
