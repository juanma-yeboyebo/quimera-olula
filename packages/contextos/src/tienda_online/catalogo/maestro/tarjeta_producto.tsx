import { FactoryCtx } from "@olula/lib/factory_ctx.tsx";
import { ComponentType, useContext } from "react";
import { Link } from "react-router";
import { formatearPrecio } from "../../comun/dominio.ts";
import { SinImagen } from "../../comun/componentes/sin_imagen.tsx";
import { ProductoCatalogo } from "../diseño.ts";
import { estaDisponible } from "../dominio.ts";
import "./tarjeta_producto.css";

export const TarjetaProducto = ({
    producto,
    idioma,
}: {
    producto: ProductoCatalogo;
    idioma: string;
}) => {
    const { app } = useContext(FactoryCtx);
    const Acciones = app.TiendaOnline?.tarjeta_producto_acciones as
        | ComponentType<{ producto: ProductoCatalogo }>
        | null
        | undefined;

    return (
        <article className="tarjeta-producto">
            <Link to={`/producto/${producto.slug}`} className="tarjeta-producto-enlace">
                <div className="tarjeta-producto-imagen">
                    {producto.imagen ? (
                        <img
                            src={producto.imagen.url}
                            alt={producto.imagen.alt ?? producto.descripcion}
                            loading="lazy"
                        />
                    ) : (
                        <SinImagen />
                    )}
                    {producto.destacado && (
                        <span className="tarjeta-producto-distintivo">Destacado</span>
                    )}
                </div>
                <h3>{producto.descripcion}</h3>
                {producto.descripcionCorta && <p>{producto.descripcionCorta}</p>}
                <div className="tarjeta-producto-precio">
                    {formatearPrecio(producto.precioConIva, producto.divisa, idioma)}
                </div>
                {!estaDisponible(producto) && (
                    <span className="tarjeta-producto-sin-stock">Sin stock</span>
                )}
            </Link>
            {Acciones && <Acciones producto={producto} />}
        </article>
    );
};
