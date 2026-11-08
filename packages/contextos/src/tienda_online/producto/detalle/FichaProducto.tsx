import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { FactoryCtx } from "@olula/lib/factory_ctx.tsx";
import { ComponentType, Fragment, useContext, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { ConStoreView } from "../../comun/componentes/con_storeview.tsx";
import { BotonTienda } from "../../comun/componentes/boton_tienda.tsx";
import { ImagenProducto as ImagenProductoTienda } from "../../comun/componentes/imagen_producto.tsx";
import { PrecioTienda } from "../../comun/componentes/precio_tienda.tsx";
import { SelectorCantidad } from "../../comun/componentes/selector_cantidad.tsx";
import { useCategoriasTienda } from "../../comun/categorias_store.ts";
import { rutaCategoria } from "../../catalogo/dominio.ts";
import { FichaProducto as Ficha, ImagenProducto } from "../diseño.ts";
import { estaDisponible, imagenInicial, metadatosFicha, textoDisponibilidad } from "../dominio.ts";
import { contextoFichaInicial } from "./detalle.ts";
import "./FichaProducto.css";
import { getMaquina } from "./maquina.ts";

const fijarMetadatos = (ficha: Ficha) => {
    const { titulo, descripcion } = metadatosFicha(ficha);
    document.title = titulo;
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
        meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
    }
    meta.content = descripcion;
};

const Galeria = ({ ficha }: { ficha: Ficha }) => {
    const [elegida, setElegida] = useState<ImagenProducto | null>(imagenInicial(ficha.imagenes));
    const mostrada = elegida ?? imagenInicial(ficha.imagenes);

    return (
        <div className={`ficha-galeria${ficha.imagenes.length > 1 ? " ficha-galeria-con-miniaturas" : ""}`}>
            {ficha.imagenes.length > 1 && (
                <div className="ficha-miniaturas">
                    {ficha.imagenes.map((img) => (
                        <button
                            type="button"
                            key={img.url}
                            aria-label={`Ver imagen ${img.alt ?? ficha.descripcion}`}
                            aria-pressed={img.url === mostrada?.url}
                            onClick={() => setElegida(img)}
                        >
                            <img src={img.url} alt="" />
                        </button>
                    ))}
                </div>
            )}
            <div className="ficha-imagen">
                <ImagenProductoTienda imagen={mostrada} prioritaria />
            </div>
        </div>
    );
};

const Migas = ({ ficha }: { ficha: Ficha }) => {
    const arbol = useCategoriasTienda();
    const primera = ficha.categorias[0];
    const ruta = primera ? rutaCategoria(arbol, primera.slug) : [];

    return (
        <nav className="ficha-migas" aria-label="Migas de pan">
            <Link to="/">Inicio</Link>
            {ruta.map((c) => (
                <Fragment key={c.slug}>
                    <span aria-hidden="true">/</span>
                    <Link to={`/categoria/${c.slug}`}>{c.nombre}</Link>
                </Fragment>
            ))}
            <span aria-hidden="true">/</span>
            <span aria-current="page">{ficha.descripcion}</span>
        </nav>
    );
};

const ContenidoFicha = () => {
    const { slug } = useParams();
    const { app } = useContext(FactoryCtx);
    const Acciones = app.TiendaOnline?.ficha_acciones as
        | ComponentType<{ ficha: Ficha }>
        | null
        | undefined;
    const { ctx, emitir } = useMaquina(getMaquina, contextoFichaInicial);
    const { estado, ficha, cantidad, aviso, error } = ctx;
    const enCurso = useRef(false);
    const [bloqueado, setBloqueado] = useState(false);

    const anadir = async () => {
        if (enCurso.current) return;
        enCurso.current = true;
        setBloqueado(true);
        try {
            await emitir("anadir_solicitado");
        } finally {
            enCurso.current = false;
            setBloqueado(false);
        }
    };

    useEffect(() => {
        emitir("slug_cambiado", slug);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug]);

    useEffect(() => {
        if (!ficha) return;
        const tituloPrevio = document.title;
        const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
        const descripcionPrevia = meta ? meta.content : null;
        fijarMetadatos(ficha);
        return () => {
            document.title = tituloPrevio;
            const actual = document.querySelector<HTMLMetaElement>('meta[name="description"]');
            if (!actual) return;
            if (descripcionPrevia === null) actual.remove();
            else actual.content = descripcionPrevia;
        };
    }, [ficha]);

    if (estado === "CARGANDO" && !ficha) return <p>Cargando...</p>;
    if (estado === "NO_ENCONTRADO")
        return (
            <div className="FichaProducto" role="alert">
                <p>Este producto no está disponible</p>
                <Link to="/catalogo">Volver al catálogo</Link>
            </div>
        );
    if (estado === "ERROR" || !ficha)
        return (
            <div className="FichaProducto" role="alert">
                <p>No se ha podido cargar el producto</p>
                <button type="button" onClick={() => emitir("reintentar", slug)}>
                    Reintentar
                </button>
            </div>
        );

    const disponible = estaDisponible(ficha);
    const deshabilitado = !disponible || bloqueado || estado === "AÑADIENDO";
    const maximo = ficha.sinControlStock ? undefined : ficha.cantidadDisponible;
    const textoBoton = disponible ? "Añadir al carrito" : "Agotado";

    return (
        <div className="FichaProducto">
            <div className="ficha-contenedor">
                <Migas ficha={ficha} />
                <div className="ficha-rejilla">
                    <Galeria key={ficha.referencia} ficha={ficha} />
                    <div className="ficha-datos">
                        <h1>{ficha.descripcion}</h1>
                        <div className="ficha-precio">
                            <PrecioTienda importe={ficha.precioConIva} divisa={ficha.divisa} grande />
                            <small>IVA incluido</small>
                        </div>
                        {ficha.descripcionCorta && <p className="ficha-corta">{ficha.descripcionCorta}</p>}
                        <p className={`ficha-disponibilidad ${disponible ? "ficha-disponible" : "ficha-sin-stock"}`}>
                            <span className="ficha-punto" aria-hidden="true" />
                            {textoDisponibilidad(ficha)}
                        </p>
                        <div className="ficha-compra">
                            <SelectorCantidad
                                valor={cantidad}
                                minimo={1}
                                maximo={maximo}
                                onCambiar={(v) => emitir("cantidad_cambiada", v)}
                            />
                            <BotonTienda
                                variante="principal"
                                ancho
                                deshabilitado={deshabilitado}
                                onClick={anadir}
                            >
                                {textoBoton}
                            </BotonTienda>
                            {Acciones && <Acciones ficha={ficha} />}
                        </div>
                        {aviso && (
                            <p role="status" className="ficha-aviso">
                                {aviso}. <Link to="/carrito">Ver carrito</Link>
                            </p>
                        )}
                        {error && (
                            <p role="alert" className="ficha-error">
                                {error}
                            </p>
                        )}
                        {ficha.descripcionLarga && (
                            <details className="ficha-desplegable" open>
                                <summary>Descripción</summary>
                                <div className="ficha-larga">{ficha.descripcionLarga}</div>
                            </details>
                        )}
                        {ficha.categorias.length > 1 && (
                            <div className="ficha-categorias">
                                {ficha.categorias.slice(1).map((c) => (
                                    <Link key={c.id} to={`/categoria/${c.slug}`}>
                                        {c.nombre}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="ficha-barra-movil">
                <PrecioTienda importe={ficha.precioConIva} divisa={ficha.divisa} grande />
                <BotonTienda variante="principal" deshabilitado={deshabilitado} onClick={anadir}>
                    {disponible ? "Añadir" : "Agotado"}
                </BotonTienda>
            </div>
        </div>
    );
};

export const FichaProducto = () => (
    <ConStoreView>{() => <ContenidoFicha />}</ConStoreView>
);
