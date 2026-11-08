import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import { BotonTienda } from "../../comun/componentes/boton_tienda.tsx";
import { ConStoreView } from "../../comun/componentes/con_storeview.tsx";
import { hayMas } from "../../comun/dominio.ts";
import { CategoriaTienda, ContextoCatalogo, OrdenCatalogo } from "../diseño.ts";
import {
    filtrosAUrl,
    filtrosDesdeUrl,
    opcionesOrden,
    rutaCategoria,
} from "../dominio.ts";
import { getCategorias } from "../infraestructura.ts";
import "./CatalogoTienda.css";
import { getMaquina } from "./maquina.ts";
import { TarjetaProducto } from "./tarjeta_producto.tsx";

const ArbolCategorias = ({
    nodos,
    activas,
    activa,
}: {
    nodos: CategoriaTienda[];
    activas: string[];
    activa: string | null;
}) => (
    <ul>
        {nodos.map((nodo) => (
            <li key={nodo.id}>
                <Link
                    to={`/categoria/${nodo.slug}`}
                    aria-current={nodo.slug === activa ? "page" : undefined}
                    className={nodo.slug === activa ? "activa" : undefined}
                >
                    {nodo.nombre}
                </Link>
                {nodo.hijas.length > 0 && activas.includes(nodo.slug) && (
                    <ArbolCategorias nodos={nodo.hijas} activas={activas} activa={activa} />
                )}
            </li>
        ))}
    </ul>
);

const ContenidoCatalogo = () => {
    const { slug } = useParams();
    const [params, setParams] = useSearchParams();
    const filtros = useMemo(
        () => filtrosDesdeUrl(params, slug ?? null),
        [params, slug]
    );
    const claveFiltros = JSON.stringify(filtros);

    const { ctx, emitir } = useMaquina(getMaquina, {
        estado: "CARGANDO",
        productos: [],
        total: 0,
        pagina: 1,
        filtros,
    } as ContextoCatalogo);

    const [categorias, setCategorias] = useState<CategoriaTienda[]>([]);

    useEffect(() => {
        getCategorias().then(setCategorias).catch(() => setCategorias([]));
    }, []);

    useEffect(() => {
        emitir("filtros_cambiados", filtros);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [claveFiltros]);

    const aplicar = (parcial: Partial<typeof filtros>) =>
        setParams(filtrosAUrl({ ...filtros, ...parcial }), { replace: true });

    const ruta = filtros.categoria ? rutaCategoria(categorias, filtros.categoria) : [];
    const { estado, productos, total } = ctx;

    const titulo = filtros.texto
        ? `Resultados de «${filtros.texto}»`
        : (ruta[ruta.length - 1]?.nombre ?? "Todo el catálogo");
    const quitarBusqueda = filtrosAUrl({ ...filtros, texto: "" }).toString();
    const cargando = estado === "CARGANDO";

    return (
        <div className="CatalogoTienda">
            <aside aria-label="Categorías">
                <h2>Categorías</h2>
                <ul>
                    <li>
                        <Link
                            to="/catalogo"
                            className={filtros.categoria ? undefined : "activa"}
                        >
                            Todo
                        </Link>
                    </li>
                </ul>
                <ArbolCategorias
                    nodos={categorias}
                    activas={ruta.map((c) => c.slug)}
                    activa={filtros.categoria}
                />
            </aside>
            <section>
                <nav aria-label="Miga de pan" className="catalogo-miga">
                    <Link to="/">Inicio</Link>
                    {filtros.categoria ? (
                        ruta.map((c) => (
                            <Fragment key={c.id}>
                                {" › "}
                                <Link to={`/categoria/${c.slug}`}>{c.nombre}</Link>
                            </Fragment>
                        ))
                    ) : (
                        <>
                            {" › "}
                            <Link to="/catalogo">Catálogo</Link>
                        </>
                    )}
                </nav>
                <header className="catalogo-cabecera">
                    <div className="catalogo-titulo">
                        <h1>{titulo}</h1>
                        {estado === "LISTO" && (
                            <span className="catalogo-total">{total} productos</span>
                        )}
                        {filtros.texto && (
                            <Link to={{ search: quitarBusqueda }} replace>
                                Quitar búsqueda
                            </Link>
                        )}
                    </div>
                    <div className="catalogo-filtros">
                        <select
                            aria-label="Ordenar por"
                            value={filtros.orden}
                            onChange={(e) => aplicar({ orden: e.target.value as OrdenCatalogo })}
                        >
                            {opcionesOrden.map((o) => (
                                <option key={o.valor} value={o.valor}>
                                    {o.descripcion}
                                </option>
                            ))}
                        </select>
                        <label className="catalogo-interruptor">
                            <input
                                type="checkbox"
                                checked={filtros.soloDestacados}
                                onChange={(e) => aplicar({ soloDestacados: e.target.checked })}
                            />
                            <span>Solo destacados</span>
                        </label>
                    </div>
                </header>

                {cargando && (
                    <div className="catalogo-rejilla" aria-busy="true">
                        {Array.from({ length: 8 }, (_, i) => (
                            <div key={i} className="catalogo-esqueleto" />
                        ))}
                    </div>
                )}
                {estado === "ERROR" && (
                    <div role="alert" className="catalogo-error">
                        <p>No se ha podido cargar el catálogo</p>
                        <BotonTienda onClick={() => emitir("reintentar")}>Reintentar</BotonTienda>
                    </div>
                )}
                {estado === "LISTO" && productos.length === 0 && (
                    <div className="catalogo-vacio">
                        <p>No hay productos que coincidan con la búsqueda</p>
                        <Link to="/catalogo">Ver todo el catálogo</Link>
                    </div>
                )}
                {estado === "LISTO" && productos.length > 0 && (
                    <>
                        <div className="catalogo-rejilla">
                            {productos.map((p) => (
                                <TarjetaProducto key={p.referencia} producto={p} />
                            ))}
                        </div>
                        <div className="catalogo-pie">
                            <p>
                                Has visto {productos.length} de {total} productos
                            </p>
                            {hayMas(productos.length, total) && (
                                <BotonTienda
                                    variante="secundario"
                                    onClick={() => emitir("siguiente_pagina")}
                                >
                                    Ver más
                                </BotonTienda>
                            )}
                        </div>
                    </>
                )}
            </section>
        </div>
    );
};

export const CatalogoTienda = () => (
    <ConStoreView>{() => <ContenidoCatalogo />}</ConStoreView>
);
