import { QIcono } from "@olula/componentes/atomos/qicono.tsx";
import { estaAutentificado } from "@olula/componentes/plantilla/autenticacion.ts";
import { FactoryCtx } from "@olula/lib/factory_ctx.tsx";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { CategoriaTienda } from "../../catalogo/diseño.ts";
import { abrirCajonCarrito } from "../cajon_carrito_store.ts";
import { useCategoriasTienda } from "../categorias_store.ts";
import { categoriasEnMenu, contenidoMega, nodoDeRuta, repartirMenu } from "../dominio.ts";
import { ContextoMenuMovil } from "./contexto_menu_movil.ts";
import "./menu_categorias_tienda.css";

const RETARDO_APERTURA = 100;

const TeselaCategoria = ({ categoria }: { categoria: CategoriaTienda }) => {
    const { app } = useContext(FactoryCtx);
    const ruta = app.TiendaOnline?.ruta_imagenes_categoria ?? "/categorias";
    const [sinFoto, setSinFoto] = useState(false);

    return (
        <Link className="menu-tesela" to={`/categoria/${categoria.slug}`}>
            {!sinFoto && (
                <img src={`${ruta}/${categoria.slug}.jpg`} alt="" loading="lazy" onError={() => setSinFoto(true)} />
            )}
            {categoria.nombre}
        </Link>
    );
};

const ContenidoCategoria = ({ categoria }: { categoria: CategoriaTienda }) => {
    const { columnas, sueltas } = contenidoMega(categoria);
    const soloSueltas = columnas.length === 0;

    return (
        <div className="menu-contenido">
            <Link className="menu-contenido-todo" to={`/categoria/${categoria.slug}`}>
                Ver todo en {categoria.nombre} →
            </Link>
            {columnas.length > 0 && (
                <div className="menu-contenido-columnas">
                    {columnas.map((c) => (
                        <div key={c.categoria.id} className="menu-contenido-columna">
                            <Link className="menu-contenido-titulo" to={`/categoria/${c.categoria.slug}`}>
                                {c.categoria.nombre}
                            </Link>
                            {c.nietas.map((n) => (
                                <Link key={n.id} to={`/categoria/${n.slug}`}>
                                    {n.nombre}
                                </Link>
                            ))}
                            {c.verMas && <Link to={`/categoria/${c.categoria.slug}`}>Ver más</Link>}
                        </div>
                    ))}
                </div>
            )}
            {soloSueltas && (
                <div className="menu-teselas">
                    {sueltas.map((s) => (
                        <TeselaCategoria key={s.id} categoria={s} />
                    ))}
                </div>
            )}
            {sueltas.length > 0 && !soloSueltas && (
                <div
                    className="menu-contenido-sueltas"
                >
                    {sueltas.map((s) => (
                        <Link key={s.id} to={`/categoria/${s.slug}`}>
                            {s.nombre}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

const BarraMenu = ({ categorias }: { categorias: CategoriaTienda[] }) => {
    const { app } = useContext(FactoryCtx);
    const { pathname } = useLocation();
    const maxEnBarra = (app.TiendaOnline?.menu_max_en_barra ?? 8) as number;
    const enBarraConTodas = (app.TiendaOnline?.menu_en_barra_con_todas ?? 6) as number;
    const { conTodas, enBarra } = repartirMenu(categorias, maxEnBarra, enBarraConTodas);

    const raiz = useRef<HTMLDivElement>(null);
    const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [abierta, setAbierta] = useState<string | null>(null);
    const [todas, setTodas] = useState(false);
    const [marcada, setMarcada] = useState<string | null>(null);

    const anular = () => {
        if (temporizador.current) clearTimeout(temporizador.current);
        temporizador.current = null;
    };

    const cerrar = () => {
        anular();
        setAbierta(null);
        setTodas(false);
    };

    const abrirCon = (slug: string, inmediato: boolean) => {
        anular();
        if (todas) return;
        if (inmediato) setAbierta(slug);
        else temporizador.current = setTimeout(() => setAbierta(slug), RETARDO_APERTURA);
    };

    const cerrarSiSaleFoco = (e: React.FocusEvent) => {
        if (!raiz.current?.contains(e.relatedTarget as Node | null)) cerrar();
    };

    useEffect(() => {
        cerrar();
    }, [pathname]);

    useEffect(() => {
        if (!abierta && !todas) return;
        const alTeclear = (e: KeyboardEvent) => {
            if (e.key === "Escape") cerrar();
        };
        const alPulsar = (e: MouseEvent) => {
            if (todas && !raiz.current?.contains(e.target as Node)) cerrar();
        };
        document.addEventListener("keydown", alTeclear);
        document.addEventListener("mousedown", alPulsar);
        return () => {
            document.removeEventListener("keydown", alTeclear);
            document.removeEventListener("mousedown", alPulsar);
        };
    }, [abierta, todas]);

    useEffect(() => anular, []);

    const categoriaAbierta = enBarra.find((c) => c.slug === abierta);
    const categoriaMarcada = categorias.find((c) => c.slug === marcada) ?? categorias[0];

    const alternarTodas = () => {
        anular();
        setAbierta(null);
        setMarcada(categorias[0]?.slug ?? null);
        setTodas(!todas);
    };

    return (
        <div
            className="menu-categorias-barra"
            ref={raiz}
            onMouseLeave={cerrar}
            onBlur={cerrarSiSaleFoco}
        >
            <nav className="menu-categorias-tienda" aria-label="Categorías">
                {conTodas && (
                    <button
                        type="button"
                        className="menu-categorias-todas"
                        aria-expanded={todas}
                        aria-controls="menu-categorias-todas-panel"
                        onClick={alternarTodas}
                    >
                        <QIcono nombre="menu" tamaño="sm" />
                        Todas las categorías
                    </button>
                )}
                {enBarra.map((c) => (
                    <NavLink
                        key={c.id}
                        to={`/categoria/${c.slug}`}
                        onMouseEnter={() => (c.hijas.length ? abrirCon(c.slug, false) : (anular(), setAbierta(null)))}
                        onFocus={() => (c.hijas.length ? abrirCon(c.slug, true) : setAbierta(null))}
                    >
                        {c.nombre}
                    </NavLink>
                ))}
            </nav>
            {categoriaAbierta && !todas && (
                <div className="menu-panel">
                    <div className="menu-panel-interior">
                        <ContenidoCategoria categoria={categoriaAbierta} />
                    </div>
                </div>
            )}
            {todas && (
                <div className="menu-panel" id="menu-categorias-todas-panel">
                    <div className="menu-panel-interior menu-panel-todas">
                        <ul className="menu-todas-lista">
                            {categorias.map((c) => (
                                <li key={c.id}>
                                    <Link
                                        to={`/categoria/${c.slug}`}
                                        aria-current={c.slug === categoriaMarcada?.slug ? "true" : undefined}
                                        onMouseEnter={() => setMarcada(c.slug)}
                                        onFocus={() => setMarcada(c.slug)}
                                    >
                                        {c.nombre}
                                        {c.hijas.length > 0 && <span aria-hidden="true">›</span>}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        {categoriaMarcada && <ContenidoCategoria categoria={categoriaMarcada} />}
                    </div>
                </div>
            )}
        </div>
    );
};

const CajonMenu = ({ categorias }: { categorias: CategoriaTienda[] }) => {
    const { abierto, cerrar } = useContext(ContextoMenuMovil);
    const { pathname } = useLocation();
    const [ruta, setRuta] = useState<string[]>([]);
    const cajon = useRef<HTMLElement>(null);
    const nodo = nodoDeRuta(categorias, ruta);
    const hijas = nodo ? nodo.hijas : categorias;

    useEffect(() => {
        if (abierto) cerrar();
    }, [pathname]);

    useEffect(() => {
        if (!abierto) {
            setRuta([]);
            return;
        }
        cajon.current?.focus();
        const anterior = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const alTeclear = (e: KeyboardEvent) => {
            if (e.key === "Escape") cerrar();
        };
        document.addEventListener("keydown", alTeclear);
        return () => {
            document.body.style.overflow = anterior;
            document.removeEventListener("keydown", alTeclear);
        };
    }, [abierto, cerrar]);

    return (
        <>
            <div
                className="menu-cajon-velo"
                data-abierto={abierto}
                onClick={cerrar}
                aria-hidden="true"
            />
            <aside
                className="menu-cajon"
                data-abierto={abierto}
                ref={cajon}
                tabIndex={-1}
                aria-label="Menú"
                aria-hidden={!abierto}
            >
                <div className="menu-cajon-cabecera">
                    {nodo ? (
                        <button type="button" onClick={() => setRuta(ruta.slice(0, -1))}>
                            ‹ Atrás
                        </button>
                    ) : (
                        <strong>Menú</strong>
                    )}
                    <button type="button" aria-label="Cerrar menú" onClick={cerrar}>
                        <QIcono nombre="cerrar" tamaño="md" />
                    </button>
                </div>
                <div className="menu-cajon-nivel" key={ruta.join("/")}>
                    {nodo && (
                        <>
                            <strong className="menu-cajon-titulo">{nodo.nombre}</strong>
                            <Link className="menu-cajon-fila menu-cajon-todo" to={`/categoria/${nodo.slug}`}>
                                Ver todo en {nodo.nombre}
                            </Link>
                        </>
                    )}
                    {hijas.map((c) =>
                        c.hijas.length > 0 ? (
                            <button
                                key={c.id}
                                type="button"
                                className="menu-cajon-fila"
                                onClick={() => setRuta([...ruta, c.slug])}
                            >
                                {c.nombre}
                                <span aria-hidden="true">›</span>
                            </button>
                        ) : (
                            <Link key={c.id} className="menu-cajon-fila" to={`/categoria/${c.slug}`}>
                                {c.nombre}
                            </Link>
                        ),
                    )}
                    {!nodo && (
                        <>
                            {estaAutentificado() ? (
                                <Link className="menu-cajon-fila menu-cajon-secundaria" to="/mi-cuenta">
                                    Mi cuenta
                                </Link>
                            ) : (
                                <Link className="menu-cajon-fila menu-cajon-secundaria" to="/login">
                                    Entrar
                                </Link>
                            )}
                            <button
                                type="button"
                                className="menu-cajon-fila menu-cajon-secundaria"
                                onClick={() => {
                                    cerrar();
                                    abrirCajonCarrito();
                                }}
                            >
                                Carrito
                            </button>
                        </>
                    )}
                </div>
            </aside>
        </>
    );
};

export const MenuCategoriasTienda = () => {
    const todas = useCategoriasTienda();
    const categorias = useMemo(() => categoriasEnMenu(todas), [todas]);

    if (categorias.length === 0) return null;

    return (
        <>
            <BarraMenu categorias={categorias} />
            <CajonMenu categorias={categorias} />
        </>
    );
};
