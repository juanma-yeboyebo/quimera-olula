import { FactoryCtx } from "@olula/lib/factory_ctx.tsx";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import { ProductoCatalogo } from "../catalogo/diseño.ts";
import { filtrosPorDefecto } from "../catalogo/dominio.ts";
import { getCatalogo } from "../catalogo/infraestructura.ts";
import { TarjetaProducto } from "../catalogo/maestro/tarjeta_producto.tsx";
import { BotonTienda } from "../comun/componentes/boton_tienda.tsx";
import { ConStoreView } from "../comun/componentes/con_storeview.tsx";
import { useCategoriasTienda } from "../comun/categorias_store.ts";
import { useStoreView } from "../comun/usar_storeview.ts";
import { useHueco } from "../comun/layout/usar_hueco.ts";
import "./InicioTienda.css";

const MAX_CATEGORIAS = 8;
const MAX_DESTACADOS = 8;

const HuecoVacio = () => null;

const PortadaBase = () => {
    const sv = useStoreView();
    const nombre = sv.estado === "LISTO" ? sv.storeView.website.nombre : "";
    const { app } = useContext(FactoryCtx);
    const ruta = app.TiendaOnline?.ruta_imagenes_inicio ?? "/inicio";
    const [sinFoto, setSinFoto] = useState(false);

    return (
        <section className={`inicio-portada${sinFoto ? " inicio-portada-sin-foto" : ""}`}>
            <div className="inicio-portada-texto">
                <h1>{nombre}</h1>
                <p>Descubre nuestro catálogo</p>
                <BotonTienda a="/catalogo">Ver el catálogo</BotonTienda>
            </div>
            {!sinFoto && (
                <img
                    className="inicio-portada-foto"
                    src={`${ruta}/portada.jpg`}
                    alt=""
                    onError={() => setSinFoto(true)}
                />
            )}
        </section>
    );
};

const TarjetaCategoria = ({ nombre, slug }: { nombre: string; slug: string }) => {
    const { app } = useContext(FactoryCtx);
    const ruta = app.TiendaOnline?.ruta_imagenes_categoria ?? "/categorias";
    const [sinFoto, setSinFoto] = useState(false);

    return (
        <Link to={`/categoria/${slug}`} className="inicio-categoria">
            <div className="inicio-categoria-foto">
                {sinFoto ? (
                    <span>{nombre}</span>
                ) : (
                    <img
                        src={`${ruta}/${slug}.jpg`}
                        alt=""
                        loading="lazy"
                        onError={() => setSinFoto(true)}
                    />
                )}
            </div>
            {!sinFoto && <span className="inicio-categoria-nombre">{nombre}</span>}
        </Link>
    );
};

const Categorias = () => {
    const categorias = useCategoriasTienda().slice(0, MAX_CATEGORIAS);
    if (categorias.length === 0) return null;

    return (
        <section className="inicio-seccion">
            <div className="inicio-seccion-cabecera">
                <h2>Categorías</h2>
            </div>
            <div className="inicio-categorias">
                {categorias.map((c) => (
                    <TarjetaCategoria key={c.id} nombre={c.nombre} slug={c.slug} />
                ))}
            </div>
        </section>
    );
};

const Destacados = () => {
    const [productos, setProductos] = useState<ProductoCatalogo[]>([]);

    useEffect(() => {
        let vivo = true;
        getCatalogo({ ...filtrosPorDefecto, soloDestacados: true }, 1)
            .then((r) => vivo && setProductos(r.productos.slice(0, MAX_DESTACADOS)))
            .catch(() => vivo && setProductos([]));
        return () => {
            vivo = false;
        };
    }, []);

    if (productos.length === 0) return null;

    return (
        <section className="inicio-seccion">
            <div className="inicio-seccion-cabecera">
                <h2>Destacados</h2>
                <Link to="/catalogo?destacados=1">Ver todo</Link>
            </div>
            <div className="inicio-destacados">
                {productos.map((p) => (
                    <TarjetaProducto key={p.referencia} producto={p} />
                ))}
            </div>
        </section>
    );
};

const ContenidoInicio = () => {
    const Portada = useHueco("inicio_portada", PortadaBase);
    const Ventajas = useHueco("inicio_ventajas", HuecoVacio);

    return (
        <div className="InicioTienda">
            <Portada />
            <div className="inicio-contenedor">
                <Categorias />
                <Destacados />
            </div>
            <Ventajas />
        </div>
    );
};

export const InicioTienda = () => (
    <ConStoreView>{() => <ContenidoInicio />}</ConStoreView>
);
