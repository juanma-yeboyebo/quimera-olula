import { QIcono } from "@olula/componentes/atomos/qicono.tsx";
import { FactoryCtx } from "@olula/lib/factory_ctx.tsx";
import { ComponentType, useContext, useState } from "react";
import { Link } from "react-router";
import { DistintivoTienda } from "../../comun/componentes/distintivo_tienda.tsx";
import { ImagenProducto } from "../../comun/componentes/imagen_producto.tsx";
import { PrecioTienda } from "../../comun/componentes/precio_tienda.tsx";
import { anadirRapido } from "../../producto/anadir.ts";
import { ProductoCatalogo } from "../diseño.ts";
import { estaDisponible } from "../dominio.ts";
import "./tarjeta_producto.css";

const BotonRapidoCarrito = ({ producto }: { producto: ProductoCatalogo }) => {
    const [anadiendo, setAnadiendo] = useState(false);

    const anadir = async () => {
        setAnadiendo(true);
        try {
            await anadirRapido(producto.referencia, producto.descripcion);
        } finally {
            setAnadiendo(false);
        }
    };

    return (
        <button
            type="button"
            className="tarjeta-producto-rapido"
            aria-label={`Añadir ${producto.descripcion} al carrito`}
            disabled={anadiendo}
            onClick={anadir}
        >
            <QIcono nombre="carrito" tamaño="md" />
        </button>
    );
};

export const TarjetaProducto = ({ producto }: { producto: ProductoCatalogo }) => {
    const { app } = useContext(FactoryCtx);
    const Acciones = app.TiendaOnline?.tarjeta_producto_acciones as
        | ComponentType<{ producto: ProductoCatalogo }>
        | null
        | undefined;
    const disponible = estaDisponible(producto);

    return (
        <article className="tarjeta-producto">
            <Link to={`/producto/${producto.slug}`} className="tarjeta-producto-enlace">
                <div
                    className={`tarjeta-producto-foto${disponible ? "" : " tarjeta-producto-agotada"}`}
                >
                    <ImagenProducto
                        imagen={
                            producto.imagen
                                ? {
                                      url: producto.imagen.url,
                                      alt: producto.imagen.alt ?? producto.descripcion,
                                  }
                                : null
                        }
                    />
                    <div className="tarjeta-producto-distintivos">
                        {!disponible && <DistintivoTienda variante="agotado">Agotado</DistintivoTienda>}
                        {producto.destacado && <DistintivoTienda>Destacado</DistintivoTienda>}
                    </div>
                </div>
                <h3>{producto.descripcion}</h3>
                {producto.descripcionCorta && (
                    <p className="tarjeta-producto-corta">{producto.descripcionCorta}</p>
                )}
                <PrecioTienda importe={producto.precioConIva} divisa={producto.divisa} />
            </Link>
            {disponible && <BotonRapidoCarrito producto={producto} />}
            {Acciones && <Acciones producto={producto} />}
        </article>
    );
};
