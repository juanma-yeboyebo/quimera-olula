import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QEtiqueta } from "@olula/componentes/atomos/qetiqueta.tsx";
import { MetaTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { ListadoSemiControlado } from "@olula/componentes/maestro/ListadoSemiControlado.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { MouseEvent, useState } from "react";
import { LineaListaRegalos } from "../../diseño.ts";
import {
    lineaEntregable,
    lineaEntregada,
    lineaLiberable,
    motivoNoBorrableLinea,
    PresentacionEstadoLinea,
    presentacionEstadoEnvio,
    presentacionEstadoPago,
} from "../../dominio.ts";

export const LineasLista = ({
    lineas,
    seleccionada,
    publicar,
}: {
    lineas: LineaListaRegalos[];
    seleccionada?: string;
    publicar: EmitirEvento;
}) => {
    const [dedicatoria, setDedicatoria] = useState<string | null>(null);

    const setSeleccionada = (linea: LineaListaRegalos) => {
        publicar("linea_seleccionada", linea);
    };

    return (
        <>
        <ListadoSemiControlado
            metaTabla={getMetaTablaLineas(lineas, publicar, setDedicatoria)}
            entidades={lineas}
            totalEntidades={lineas.length}
            cargando={false}
            seleccionada={lineas.find((l) => l.id === seleccionada) ?? null}
            onSeleccion={setSeleccionada}
            criteriaInicial={criteriaDefecto}
            onCriteriaChanged={() => null}
            modo="tabla"
            modosDisponibles={["tabla"]}
        />
        {dedicatoria !== null && (
            <QModal nombre="dedicatoriaLineaListaRegalos" titulo="Dedicatoria" abierto={true} onCerrar={() => setDedicatoria(null)}>
                <p className="LineasListaRegalos-dedicatoria">{dedicatoria}</p>
                <div className="botones">
                    <QBoton onClick={() => setDedicatoria(null)}>Cerrar</QBoton>
                </div>
            </QModal>
        )}
        </>
    );
};

const sinPropagar = (accion: () => void) => (evento: MouseEvent) => {
    evento.stopPropagation();
    accion();
};

const AccionesLinea = ({
    linea,
    indice,
    total,
    publicar,
}: {
    linea: LineaListaRegalos;
    indice: number;
    total: number;
    publicar: EmitirEvento;
}) => {
    const motivo = motivoNoBorrableLinea(linea);
    return (
        <span className="LineasListaRegalos-acciones">
            {lineaEntregable(linea) && (
                <QBoton
                    variante="texto"
                    tamaño="pequeño"
                    onClick={sinPropagar(() => publicar("entrega_de_linea_solicitada", linea.id))}
                >
                    Entregado
                </QBoton>
            )}
            {lineaEntregada(linea) && (
                <QBoton
                    variante="texto"
                    tamaño="pequeño"
                    onClick={sinPropagar(() => publicar("deshacer_entrega_de_linea_solicitado", linea.id))}
                >
                    Deshacer entrega
                </QBoton>
            )}
            {lineaLiberable(linea) && (
                <QBoton
                    variante="texto"
                    tamaño="pequeño"
                    onClick={sinPropagar(() => publicar("liberacion_de_linea_solicitada", linea))}
                >
                    Liberar
                </QBoton>
            )}
            <QBoton
                variante="texto"
                tamaño="pequeño"
                deshabilitado={indice <= 0}
                onClick={sinPropagar(() => publicar("subir_linea_solicitado", linea.id))}
            >
                Subir
            </QBoton>
            <QBoton
                variante="texto"
                tamaño="pequeño"
                deshabilitado={indice >= total - 1}
                onClick={sinPropagar(() => publicar("bajar_linea_solicitado", linea.id))}
            >
                Bajar
            </QBoton>
            <QBoton
                variante="texto"
                tamaño="pequeño"
                advertencia
                deshabilitado={motivo !== null}
                onClick={sinPropagar(() => publicar("baja_linea_solicitada", linea))}
            >
                Borrar
            </QBoton>
            {motivo && <span className="LineasListaRegalos-motivo">{motivo}</span>}
        </span>
    );
};

const Estado = ({ estado }: { estado: PresentacionEstadoLinea }) => (
    <QEtiqueta variante={estado.variante}>{estado.texto}</QEtiqueta>
);

const Foto = ({ linea }: { linea: LineaListaRegalos }) =>
    linea.imagen ? (
        <img className="LineasListaRegalos-miniatura" src={linea.imagen.url} alt={linea.imagen.alt} loading="lazy" />
    ) : (
        <QEtiqueta variante="advertencia">Sin foto</QEtiqueta>
    );

const getMetaTablaLineas = (
    lineas: LineaListaRegalos[],
    publicar: EmitirEvento,
    verDedicatoria: (texto: string) => void,
): MetaTabla<LineaListaRegalos> => [
    { id: "imagen", cabecera: "Foto", render: (l: LineaListaRegalos) => <Foto linea={l} /> },
    { id: "referencia", cabecera: "Referencia", estilo: "secundario" },
    { id: "descripcion", cabecera: "Descripción" },
    { id: "precio", cabecera: "Precio con IVA", tipo: "moneda", divisa: "EUR" },
    {
        id: "estadoPago",
        cabecera: "Pago",
        render: (l: LineaListaRegalos) => <Estado estado={presentacionEstadoPago(l)} />,
    },
    {
        id: "estadoEnvio",
        cabecera: "Envío",
        render: (l: LineaListaRegalos) => <Estado estado={presentacionEstadoEnvio(l)} />,
    },
    {
        id: "dedicatoria",
        cabecera: "Dedicatoria",
        render: (l: LineaListaRegalos) =>
            l.dedicatoria ? (
                <QBoton
                    variante="texto"
                    tamaño="pequeño"
                    props={{ title: l.dedicatoria }}
                    onClick={sinPropagar(() => verDedicatoria(l.dedicatoria ?? ""))}
                >
                    Dedicatoria
                </QBoton>
            ) : (
                ""
            ),
    },
    {
        id: "acciones",
        cabecera: "",
        render: (l: LineaListaRegalos) => (
            <AccionesLinea
                linea={l}
                indice={lineas.findIndex((x) => x.id === l.id)}
                total={lineas.length}
                publicar={publicar}
            />
        ),
    },
];
