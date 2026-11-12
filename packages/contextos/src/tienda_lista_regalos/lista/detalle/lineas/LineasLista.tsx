import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QEtiqueta } from "@olula/componentes/atomos/qetiqueta.tsx";
import { MetaTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { ListadoSemiControlado } from "@olula/componentes/maestro/ListadoSemiControlado.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { MouseEvent } from "react";
import { LineaListaRegalos } from "../../diseño.ts";
import { lineaVendida, motivoNoBorrableLinea } from "../../dominio.ts";

export const LineasLista = ({
    lineas,
    seleccionada,
    publicar,
}: {
    lineas: LineaListaRegalos[];
    seleccionada?: string;
    publicar: EmitirEvento;
}) => {
    const setSeleccionada = (linea: LineaListaRegalos) => {
        publicar("linea_seleccionada", linea);
    };

    return (
        <ListadoSemiControlado
            metaTabla={getMetaTablaLineas(lineas, publicar)}
            entidades={lineas}
            totalEntidades={lineas.length}
            cargando={false}
            seleccionada={lineas.find((l) => l.id === seleccionada) ?? null}
            onSeleccion={setSeleccionada}
            criteriaInicial={criteriaDefecto}
            onCriteriaChanged={() => null}
            modo="tabla"
        />
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

const getMetaTablaLineas = (
    lineas: LineaListaRegalos[],
    publicar: EmitirEvento,
): MetaTabla<LineaListaRegalos> => [
    { id: "referencia", cabecera: "Referencia", estilo: "secundario" },
    { id: "descripcion", cabecera: "Descripción" },
    { id: "precio", cabecera: "Precio con IVA", tipo: "moneda", divisa: "EUR" },
    { id: "cantidad", cabecera: "Cantidad", tipo: "numero" },
    { id: "cantidadVendida", cabecera: "Vendidas", tipo: "numero" },
    {
        id: "pendiente",
        cabecera: "Pendiente",
        render: (l: LineaListaRegalos) =>
            lineaVendida(l) ? <QEtiqueta variante="exito">Vendido</QEtiqueta> : String(l.pendiente),
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
