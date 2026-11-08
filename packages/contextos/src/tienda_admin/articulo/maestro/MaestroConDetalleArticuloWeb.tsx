import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QSelect } from "@olula/componentes/atomos/qselect.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { MetaTabla } from "@olula/componentes/index.js";
import { Listado } from "@olula/componentes/maestro/Listado.js";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.tsx";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { getIdUrlParams, useUrlParams } from "@olula/lib/url-params.js";
import { useEffect, useMemo, useState } from "react";
import { SelectorWebsite } from "../../comun/componentes/SelectorWebsite.tsx";
import { useWebsiteActivo } from "../../comun/website_store.ts";
import { DetalleArticuloWeb } from "../detalle/DetalleArticuloWeb.tsx";
import { ArticuloWeb, EstadoPublicacionFiltro } from "../diseño.ts";
import { distintivosArticulo, filtrosArticuloIniciales, opcionesEstadoFiltro } from "../dominio.ts";
import { getMaquina } from "./maquina.ts";
import "./MaestroConDetalleArticuloWeb.css";

const Miniatura = ({ url }: { url: string | null }) =>
    url ? <img className="ArticuloWeb-miniatura" src={url} alt="" loading="lazy" /> : <span className="ArticuloWeb-miniatura" />;

const Distintivos = ({ articulo }: { articulo: ArticuloWeb }) => (
    <span className="ArticuloWeb-distintivos">
        {distintivosArticulo(articulo).map((d) => (
            <span key={d} className="ArticuloWeb-distintivo">
                {d}
            </span>
        ))}
    </span>
);

const metaTablaArticuloWeb: MetaTabla<ArticuloWeb> = [
    { id: "imagen", cabecera: "", render: (a: ArticuloWeb) => <Miniatura url={a.imagen} /> },
    { id: "referencia", cabecera: "Referencia" },
    { id: "descripcion", cabecera: "Descripción" },
    { id: "estado", cabecera: "Estado", render: (a: ArticuloWeb) => <Distintivos articulo={a} /> },
];

const TarjetaArticuloWeb = (articulo: ArticuloWeb) => (
    <div className="ArticuloWeb-tarjeta" key={articulo.id}>
        <Miniatura url={articulo.imagen} />
        <div>
            <div>
                <strong>{articulo.referencia}</strong>
            </div>
            <div>{articulo.descripcion}</div>
            <Distintivos articulo={articulo} />
        </div>
    </div>
);

export const MaestroConDetalleArticuloWeb = () => {
    const criteriaBase = useMemo(() => criteriaDefecto, []);
    const id = getIdUrlParams();

    const { ctx, emitir } = useMaquina(getMaquina, {
        estado: "INICIAL",
        articulos: listaActivaEntidadesInicial<ArticuloWeb>(id, criteriaBase),
        filtros: filtrosArticuloIniciales,
        opcionesCategoria: [{ valor: "", descripcion: "Todas las categorías" }],
    });

    const { articulos, filtros, opcionesCategoria } = ctx;
    const websiteId = useWebsiteActivo();
    const [texto, setTexto] = useState("");

    useUrlParams(articulos.activo, articulos.criteria);

    useEffect(() => {
        if (websiteId !== null) emitir("website_cambiado", websiteId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [websiteId]);

    return (
        <div className="ArticuloWebTiendaAdmin">
            <MaestroDetalle<ArticuloWeb>
                Maestro={
                    <>
                        <h2>Artículos web</h2>
                        <SelectorWebsite />
                        <div className="ArticuloWeb-filtros">
                            <QInput
                                label="Buscar"
                                nombre="texto"
                                valor={texto}
                                onChange={(valor) => setTexto(valor as string)}
                                onEnterKeyUp={(valor) => emitir("filtros_cambiados", { texto: valor })}
                                onBlur={(valor) => {
                                    if (valor !== filtros.texto) emitir("filtros_cambiados", { texto: valor });
                                }}
                            />
                            <QSelect
                                label="Estado"
                                nombre="estado"
                                valor={filtros.estado}
                                opciones={opcionesEstadoFiltro}
                                onChange={(opcion) =>
                                    emitir("filtros_cambiados", {
                                        estado: (opcion?.valor ?? "todos") as EstadoPublicacionFiltro,
                                    })
                                }
                            />
                            <QSelect
                                label="Categoría"
                                nombre="categoria"
                                valor={filtros.categoriaId ?? ""}
                                opciones={opcionesCategoria}
                                onChange={(opcion) =>
                                    emitir("filtros_cambiados", { categoriaId: opcion?.valor ? opcion.valor : null })
                                }
                            />
                        </div>
                        <Listado<ArticuloWeb>
                            metaTabla={metaTablaArticuloWeb}
                            mostrarFiltros={false}
                            criteria={articulos.criteria}
                            modoInicial="tarjetas"
                            tarjeta={TarjetaArticuloWeb}
                            entidades={articulos.lista}
                            totalEntidades={articulos.total}
                            seleccionada={articulos.activo}
                            onSeleccion={(payload) => emitir("articulo_seleccionado", payload)}
                            onCriteriaChanged={(payload) => emitir("criteria_cambiado", payload)}
                            onSiguientePagina={(payload) => emitir("siguiente_pagina", payload)}
                        />
                    </>
                }
                Detalle={
                    <DetalleArticuloWeb
                        id={articulos.activo}
                        websiteId={websiteId}
                        publicar={emitir}
                    />
                }
                seleccionada={articulos.activo}
                modoDisposicion="maestro-50"
            />
        </div>
    );
};
