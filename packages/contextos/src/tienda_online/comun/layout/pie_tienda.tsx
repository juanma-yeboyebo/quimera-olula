import { Link } from "react-router";
import { useCategoriasTienda } from "../categorias_store.ts";
import { useStoreView } from "../usar_storeview.ts";
import "./pie_tienda.css";

export const PieTienda = () => {
    const sv = useStoreView();
    const categorias = useCategoriasTienda();
    const nombre = sv.estado === "LISTO" ? sv.storeView.website.nombre : "";

    return (
        <footer className="pie-tienda">
            <div className="pie-tienda-contenedor">
                <div className="pie-tienda-columna">
                    <strong className="pie-tienda-nombre">{nombre}</strong>
                </div>
                <div className="pie-tienda-columna">
                    <h2>Categorías</h2>
                    {categorias.slice(0, 6).map((c) => (
                        <Link key={c.id} to={`/categoria/${c.slug}`}>
                            {c.nombre}
                        </Link>
                    ))}
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
