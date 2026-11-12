import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { BotonTienda } from "#/tienda_online/comun/componentes/boton_tienda.tsx";
import { ConStoreView } from "#/tienda_online/comun/componentes/con_storeview.tsx";
import { DistintivoTienda } from "#/tienda_online/comun/componentes/distintivo_tienda.tsx";
import { ImagenProducto as ImagenProductoTienda } from "#/tienda_online/comun/componentes/imagen_producto.tsx";
import { PrecioTienda } from "#/tienda_online/comun/componentes/precio_tienda.tsx";
import { SelectorCantidad } from "#/tienda_online/comun/componentes/selector_cantidad.tsx";
import { ImagenProducto } from "#/tienda_online/producto/diseño.ts";
import { imagenInicial } from "#/tienda_online/producto/dominio.ts";
import "#/tienda_online/producto/detalle/FichaProducto.css";
import { DialogoCarritoOtraLista } from "../dialogo_otra_lista/dialogo_otra_lista.tsx";
import { FichaLineaLista } from "../diseño.ts";
import { estaRegalada, metadatosFichaLinea, rutaLista, textoPendiente } from "../dominio.ts";
import { contextoFichaLineaInicial } from "./ficha.ts";
import "./FichaLineaListaRegalos.css";
import { getMaquina } from "./maquina.ts";

const fijarMetadatos = (ficha: FichaLineaLista) => {
    const { titulo, descripcion } = metadatosFichaLinea(ficha);
    document.title = titulo;
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
        meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
    }
    meta.content = descripcion;
};

const Galeria = ({ ficha }: { ficha: FichaLineaLista }) => {
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
                <ImagenProductoTienda
                    imagen={mostrada ? { url: mostrada.url, alt: mostrada.alt ?? ficha.descripcion } : null}
                    prioritaria
                />
            </div>
        </div>
    );
};

const ContenidoFicha = () => {
    const { token = "", idlinea = "" } = useParams();
    const { ctx, emitir } = useMaquina(getMaquina, contextoFichaLineaInicial);
    const { estado, ficha, cantidad, nombreLista } = ctx;
    const enCurso = useRef(false);
    const [bloqueado, setBloqueado] = useState(false);

    const lanzar = async (evento: string) => {
        if (enCurso.current) return;
        enCurso.current = true;
        setBloqueado(true);
        try {
            await emitir(evento);
        } finally {
            enCurso.current = false;
            setBloqueado(false);
        }
    };

    useEffect(() => {
        emitir("linea_cambiada", { token, idLinea: idlinea });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, idlinea]);

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
    if (estado === "NO_ENCONTRADA")
        return (
            <div className="FichaProducto FichaLineaListaRegalos contenedor-tienda" role="alert">
                <p>Este producto no está en la lista</p>
                <Link to={rutaLista(token)}>Volver a la lista</Link>
            </div>
        );
    if (estado === "ERROR" || !ficha)
        return (
            <div className="FichaProducto FichaLineaListaRegalos contenedor-tienda" role="alert">
                <p>No se ha podido cargar el producto</p>
                <BotonTienda onClick={() => emitir("reintentar")}>Reintentar</BotonTienda>
            </div>
        );

    const regalada = estaRegalada(ficha);
    const deshabilitado = bloqueado || estado === "AÑADIENDO";

    return (
        <div className="FichaProducto FichaLineaListaRegalos">
            <div className="ficha-contenedor contenedor-tienda">
                <nav className="ficha-migas" aria-label="Migas de pan">
                    <Link to={rutaLista(token)}>{nombreLista}</Link>
                    <span aria-hidden="true">›</span>
                    <span aria-current="page">{ficha.descripcion}</span>
                </nav>
                <div className="ficha-rejilla">
                    <Galeria key={ficha.id} ficha={ficha} />
                    <div className="ficha-datos">
                        <h1>{ficha.descripcion}</h1>
                        <div className="ficha-precio">
                            <PrecioTienda importe={ficha.precio} divisa={ficha.divisa} grande />
                            <small>IVA incluido</small>
                        </div>
                        {ficha.descripcionCorta && <p className="ficha-corta">{ficha.descripcionCorta}</p>}
                        <p className="ficha-lista-pendiente">{textoPendiente(ficha)}</p>
                        {regalada ? (
                            <div>
                                <DistintivoTienda variante="agotado">Regalado</DistintivoTienda>
                            </div>
                        ) : (
                            <div className="ficha-compra">
                                <SelectorCantidad
                                    valor={cantidad}
                                    minimo={1}
                                    maximo={ficha.pendiente}
                                    deshabilitado={deshabilitado}
                                    onCambiar={(v) => emitir("cantidad_cambiada", v)}
                                />
                                <BotonTienda
                                    variante="principal"
                                    ancho
                                    deshabilitado={deshabilitado}
                                    onClick={() => lanzar("anadir_solicitado")}
                                >
                                    Añadir al carrito
                                </BotonTienda>
                            </div>
                        )}
                        {ficha.descripcionLarga && (
                            <details className="ficha-desplegable" open>
                                <summary>Descripción</summary>
                                <div className="ficha-larga">{ficha.descripcionLarga}</div>
                            </details>
                        )}
                    </div>
                </div>
            </div>
            {!regalada && (
                <div className="ficha-barra-movil">
                    <PrecioTienda importe={ficha.precio} divisa={ficha.divisa} grande />
                    <BotonTienda
                        variante="principal"
                        deshabilitado={deshabilitado}
                        onClick={() => lanzar("anadir_solicitado")}
                    >
                        Añadir
                    </BotonTienda>
                </div>
            )}
            {estado === "CARRITO_DE_OTRA_LISTA" && (
                <DialogoCarritoOtraLista
                    onEmpezar={() => lanzar("carrito_nuevo_confirmado")}
                    onCancelar={() => emitir("carrito_nuevo_cancelado")}
                />
            )}
        </div>
    );
};

export const FichaLineaListaRegalos = () => (
    <ConStoreView>{() => <ContenidoFicha />}</ConStoreView>
);
