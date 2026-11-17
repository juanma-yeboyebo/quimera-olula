import "#/tienda_online/comun/layout/pie_tienda.css";
import { useStoreView } from "#/tienda_online/comun/usar_storeview.ts";
import { Link } from "react-router";

export const PieDulceBebe = () => {
    const sv = useStoreView();
    const nombre = sv.estado === "LISTO" ? sv.storeView.website.nombre : "";

    return (
        <footer className="pie-tienda">
            <div className="pie-tienda-contenedor">
                <div className="pie-tienda-columna">
                    <strong className="pie-tienda-nombre">{nombre}</strong>
                </div>
                <div className="pie-tienda-columna">
                    <h2>Cuenta</h2>
                    <Link to="/mi-cuenta">Mi cuenta</Link>
                    <Link to="/carrito">Carrito</Link>
                </div>
            </div>
            <p className="pie-tienda-copyright">
                © {new Date().getFullYear()} {nombre}
            </p>
        </footer>
    );
};
