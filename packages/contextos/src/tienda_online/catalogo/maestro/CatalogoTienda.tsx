import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import { ConStoreView } from "../../comun/componentes/con_storeview.tsx";
import { CategoriaTienda, ContextoCatalogo, OrdenCatalogo } from "../diseño.ts";
import {
    filtrosAUrl,
    filtrosDesdeUrl,
    hayMas,
    opcionesOrden,
    rutaCategoria,
} from "../dominio.ts";
import { getCategorias } from "../infraestructura.ts";
import "./CatalogoTienda.css";
import { getMaquina } from "./maquina.ts";
import { TarjetaProducto } from "./tarjeta_producto.tsx";

const RETARDO_BUSQUEDA = 400;

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

const ContenidoCatalogo = ({ idioma }: { idioma: string }) => {
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
    const [texto, setTexto] = useState(filtros.texto);

    useEffect(() => {
        getCategorias().then(setCategorias).catch(() => setCategorias([]));
    }, []);

    useEffect(() => {
        emitir("filtros_cambiados", filtros);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [claveFiltros]);

    useEffect(() => {
        setTexto((previo) => (previo.trim() === filtros.texto ? previo : filtros.texto));
    }, [filtros.texto]);

    const aplicar = (parcial: Partial<typeof filtros>) =>
        setParams(filtrosAUrl({ ...filtros, ...parcial }), { replace: true });

    useEffect(() => {
        if (texto.trim() === filtros.texto) return;
        const temporizador = setTimeout(
            () =>
                setParams(
                    (actuales) =>
                        filtrosAUrl({
                            ...filtrosDesdeUrl(actuales, slug ?? null),
                            texto: texto.trim(),
                        }),
                    { replace: true }
                ),
            RETARDO_BUSQUEDA
        );
        return () => clearTimeout(temporizador);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [texto]);

    const ruta = filtros.categoria ? rutaCategoria(categorias, filtros.categoria) : [];
    const { estado, productos, total } = ctx;

    return (
        <div className="CatalogoTienda">
            <aside aria-label="Categorías">
                <h2>Categorías</h2>
                <ArbolCategorias
                    nodos={categorias}
                    activas={ruta.map((c) => c.slug)}
                    activa={filtros.categoria}
                />
            </aside>
            <section>
                {filtros.categoria && (
                    <nav aria-label="Miga de pan" className="catalogo-miga">
                        <Link to="/">Inicio</Link>
                        {ruta.map((c) => (
                            <Fragment key={c.id}>
                                {" › "}
                                <Link to={`/categoria/${c.slug}`}>{c.nombre}</Link>
                            </Fragment>
                        ))}
                    </nav>
                )}
                <div className="catalogo-filtros">
                    <input
                        type="search"
                        aria-label="Buscar productos"
                        placeholder="Buscar productos"
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                        onKeyUp={(e) => e.key === "Enter" && aplicar({ texto: texto.trim() })}
                    />
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
                    <label>
                        <input
                            type="checkbox"
                            checked={filtros.soloDestacados}
                            onChange={(e) => aplicar({ soloDestacados: e.target.checked })}
                        />
                        Solo destacados
                    </label>
                </div>

                {estado === "CARGANDO" && <p>Cargando catálogo...</p>}
                {estado === "ERROR" && (
                    <div role="alert" className="catalogo-error">
                        <p>No se ha podido cargar el catálogo</p>
                        <button type="button" onClick={() => emitir("reintentar")}>
                            Reintentar
                        </button>
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
                        <p className="catalogo-total">{total} productos</p>
                        <div className="catalogo-rejilla">
                            {productos.map((p) => (
                                <TarjetaProducto key={p.referencia} producto={p} idioma={idioma} />
                            ))}
                        </div>
                        {hayMas(productos.length, total) && (
                            <button
                                type="button"
                                className="catalogo-ver-mas"
                                onClick={() => emitir("siguiente_pagina")}
                            >
                                Ver más
                            </button>
                        )}
                    </>
                )}
            </section>
        </div>
    );
};

export const CatalogoTienda = () => (
    <ConStoreView>{(sv) => <ContenidoCatalogo idioma={sv.idioma} />}</ConStoreView>
);
