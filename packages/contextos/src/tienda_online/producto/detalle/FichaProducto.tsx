import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { FactoryCtx } from "@olula/lib/factory_ctx.tsx";
import { ComponentType, useContext, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { ConStoreView } from "../../comun/componentes/con_storeview.tsx";
import { formatearPrecio } from "../../comun/dominio.ts";
import { SinImagen } from "../../comun/componentes/sin_imagen.tsx";
import { FichaProducto as Ficha, ImagenProducto } from "../diseño.ts";
import { estaDisponible, imagenInicial, metadatosFicha } from "../dominio.ts";
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
        <div className="ficha-galeria">
            <div className="ficha-imagen">
                {mostrada ? (
                    <img src={mostrada.url} alt={mostrada.alt ?? ficha.descripcion} />
                ) : (
                    <SinImagen />
                )}
            </div>
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
        </div>
    );
};

const ContenidoFicha = ({ idioma }: { idioma: string }) => {
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

    return (
        <div className="FichaProducto">
            <Galeria key={ficha.referencia} ficha={ficha} />
            <div className="ficha-datos">
                <h1>{ficha.descripcion}</h1>
                {ficha.descripcionCorta && <p className="ficha-corta">{ficha.descripcionCorta}</p>}
                <div className="ficha-precio">
                    {formatearPrecio(ficha.precioConIva, ficha.divisa, idioma)}
                    <small> IVA incluido</small>
                </div>
                <p className={disponible ? "ficha-disponible" : "ficha-sin-stock"}>
                    {disponible ? "Disponible" : "Sin stock"}
                </p>
                {ficha.categorias.length > 0 && (
                    <p className="ficha-categorias">
                        {ficha.categorias.map((c) => (
                            <Link key={c.id} to={`/categoria/${c.slug}`}>
                                {c.nombre}
                            </Link>
                        ))}
                    </p>
                )}
                <div className="ficha-compra">
                    <label>
                        Cantidad
                        <input
                            type="number"
                            min={1}
                            max={ficha.sinControlStock ? undefined : ficha.cantidadDisponible}
                            value={cantidad}
                            onChange={(e) => emitir("cantidad_cambiada", e.target.value)}
                        />
                    </label>
                    <button
                        type="button"
                        disabled={!disponible || bloqueado || estado === "AÑADIENDO"}
                        onClick={anadir}
                    >
                        Añadir al carrito
                    </button>
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
                    <div className="ficha-larga">{ficha.descripcionLarga}</div>
                )}
            </div>
        </div>
    );
};

export const FichaProducto = () => (
    <ConStoreView>{(sv) => <ContenidoFicha idioma={sv.idioma} />}</ConStoreView>
);
