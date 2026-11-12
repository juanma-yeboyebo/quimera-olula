import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QEtiqueta } from "@olula/componentes/atomos/qetiqueta.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { MetaTabla } from "@olula/componentes/index.js";
import { Listado } from "@olula/componentes/maestro/Listado.js";
import { MaestroDetalle } from "@olula/componentes/maestro/MaestroDetalle.tsx";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { getIdUrlParams, useUrlParams } from "@olula/lib/url-params.js";
import { useEffect, useState } from "react";
import { SelectorWebsite } from "#/tienda_admin/comun/componentes/SelectorWebsite.tsx";
import { useWebsiteActivo } from "#/tienda_admin/comun/website_store.ts";
import { CrearListaRegalos } from "../crear/CrearListaRegalos.tsx";
import { DetalleListaRegalos } from "../detalle/DetalleListaRegalos.tsx";
import { ItemListaRegalos } from "../diseño.ts";
import {
    criteriaListasDefecto,
    distintivoPublicacion,
    filtrosListaRegalosIniciales,
    textoVendidas,
} from "../dominio.ts";
import "./MaestroConDetalleListaRegalos.css";
import { getMaquina } from "./maquina.ts";

const Distintivo = ({ publicada }: { publicada: boolean }) => (
    <QEtiqueta variante={publicada ? "exito" : "gris"}>{distintivoPublicacion(publicada)}</QEtiqueta>
);

const metaTablaListaRegalos: MetaTabla<ItemListaRegalos> = [
    { id: "nombre", cabecera: "Nombre", estilo: "destacado" },
    { id: "cliente_nombre", cabecera: "Cliente", render: (l: ItemListaRegalos) => l.cliente.nombre },
    { id: "publicada", cabecera: "Estado", render: (l: ItemListaRegalos) => <Distintivo publicada={l.publicada} /> },
    { id: "vendidas", cabecera: "Vendidas", render: (l: ItemListaRegalos) => textoVendidas(l) },
];

const TarjetaListaRegalos = (lista: ItemListaRegalos) => (
    <div className="ListaRegalos-tarjeta" key={lista.id}>
        <div>
            <strong>{lista.nombre}</strong>
        </div>
        <div>{lista.cliente.nombre}</div>
        <div className="ListaRegalos-tarjeta-pie">
            <Distintivo publicada={lista.publicada} />
            <span>{textoVendidas(lista)}</span>
        </div>
    </div>
);

export const MaestroConDetalleListaRegalos = () => {
    const id = getIdUrlParams();

    const { ctx, emitir } = useMaquina(getMaquina, {
        estado: "INICIAL",
        listas: listaActivaEntidadesInicial<ItemListaRegalos>(id, criteriaListasDefecto),
        filtros: filtrosListaRegalosIniciales,
    });

    const { estado, listas, filtros } = ctx;
    const websiteId = useWebsiteActivo();
    const [texto, setTexto] = useState("");

    useUrlParams(listas.activo, listas.criteria);

    useEffect(() => {
        if (websiteId !== null) emitir("website_cambiado", websiteId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [websiteId]);

    return (
        <div className="ListaRegalos">
            <MaestroDetalle<ItemListaRegalos>
                Maestro={
                    <>
                        <h2>Listas de regalo</h2>
                        <SelectorWebsite />
                        <div className="ListaRegalos-filtros">
                            <QInput
                                label="Buscar por lista o cliente"
                                nombre="texto"
                                valor={texto}
                                onChange={(valor) => setTexto(valor as string)}
                                onEnterKeyUp={(valor) => emitir("filtros_cambiados", { texto: valor })}
                                onBlur={(valor) => {
                                    if (valor !== filtros.texto) emitir("filtros_cambiados", { texto: valor });
                                }}
                            />
                        </div>
                        <Listado<ItemListaRegalos>
                            metaTabla={metaTablaListaRegalos}
                            mostrarFiltros={false}
                            criteria={listas.criteria}
                            modoInicial="tarjetas"
                            tarjeta={TarjetaListaRegalos}
                            entidades={listas.lista}
                            totalEntidades={listas.total}
                            seleccionada={listas.activo}
                            renderAcciones={() => (
                                <div className="maestro-botones">
                                    <QBoton
                                        deshabilitado={websiteId === null}
                                        onClick={() => emitir("crear_lista_solicitado")}
                                    >
                                        Nueva lista
                                    </QBoton>
                                </div>
                            )}
                            onSeleccion={(payload) => emitir("lista_seleccionada", payload)}
                            onCriteriaChanged={(payload) => emitir("criteria_cambiado", payload)}
                            onSiguientePagina={(payload) => emitir("siguiente_pagina", payload)}
                        />
                    </>
                }
                Detalle={<DetalleListaRegalos id={listas.activo} publicar={emitir} />}
                seleccionada={listas.activo}
                modoDisposicion="maestro-50"
            />

            {estado === "CREANDO" && websiteId !== null && (
                <CrearListaRegalos websiteId={websiteId} publicar={emitir} />
            )}
        </div>
    );
};
