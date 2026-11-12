import { QIcono } from "@olula/componentes/atomos/qicono.tsx";
import { useState } from "react";
import { Link } from "react-router";
import { DistintivoTienda } from "#/tienda_online/comun/componentes/distintivo_tienda.tsx";
import { ImagenProducto } from "#/tienda_online/comun/componentes/imagen_producto.tsx";
import { PrecioTienda } from "#/tienda_online/comun/componentes/precio_tienda.tsx";
import "#/tienda_online/catalogo/maestro/tarjeta_producto.css";
import { anadirDeLista, anadirEnCarritoNuevo } from "../anadir.ts";
import { LineaListaRegalos } from "../diseño.ts";
import { DialogoCarritoOtraLista } from "../dialogo_otra_lista/dialogo_otra_lista.tsx";
import { estaRegalada, rutaLineaLista, textoPendiente } from "../dominio.ts";
import "./tarjeta_linea_lista.css";

const BotonRapidoLista = ({ token, linea }: { token: string; linea: LineaListaRegalos }) => {
    const [anadiendo, setAnadiendo] = useState(false);
    const [preguntando, setPreguntando] = useState(false);

    const ejecutar = async (accion: typeof anadirDeLista) => {
        setAnadiendo(true);
        try {
            const resultado = await accion(token, linea.referencia, linea.descripcion, 1);
            setPreguntando(resultado === "CARRITO_DE_OTRA_LISTA");
        } finally {
            setAnadiendo(false);
        }
    };

    return (
        <>
            <button
                type="button"
                className="tarjeta-producto-rapido"
                aria-label={`Añadir ${linea.descripcion} al carrito`}
                disabled={anadiendo}
                onClick={() => ejecutar(anadirDeLista)}
            >
                <QIcono nombre="carrito" tamaño="md" />
            </button>
            {preguntando && (
                <DialogoCarritoOtraLista
                    onEmpezar={() => {
                        setPreguntando(false);
                        ejecutar(anadirEnCarritoNuevo);
                    }}
                    onCancelar={() => setPreguntando(false)}
                />
            )}
        </>
    );
};

export const TarjetaLineaLista = ({ token, linea }: { token: string; linea: LineaListaRegalos }) => {
    const regalada = estaRegalada(linea);

    return (
        <article className={`tarjeta-producto tarjeta-linea-lista${regalada ? " tarjeta-linea-lista-regalada" : ""}`}>
            <Link to={rutaLineaLista(token, linea.id)} className="tarjeta-producto-enlace">
                <div className={`tarjeta-producto-foto${regalada ? " tarjeta-producto-agotada" : ""}`}>
                    <ImagenProducto
                        imagen={
                            linea.imagen
                                ? { url: linea.imagen.url, alt: linea.imagen.alt ?? linea.descripcion }
                                : null
                        }
                    />
                    {regalada && (
                        <div className="tarjeta-producto-distintivos">
                            <DistintivoTienda variante="agotado">Regalado</DistintivoTienda>
                        </div>
                    )}
                </div>
                <h3>{linea.descripcion}</h3>
                <p className="tarjeta-producto-corta tarjeta-linea-lista-pendiente">{textoPendiente(linea)}</p>
                <PrecioTienda importe={linea.precio} divisa={linea.divisa} />
            </Link>
            {!regalada && <BotonRapidoLista token={token} linea={linea} />}
        </article>
    );
};
