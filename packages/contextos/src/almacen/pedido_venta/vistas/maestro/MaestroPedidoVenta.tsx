import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QIcono } from "@olula/componentes/atomos/qicono.tsx";
import { MetaTabla } from "@olula/componentes/atomos/qtabla.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.js";
import { Listado } from "@olula/componentes/maestro/Listado.tsx";
import { criteriaDefecto } from "@olula/lib/dominio.js";
import { listaActivaEntidadesInicial } from "@olula/lib/ListaActivaEntidades.js";
import { getUrlParams, useUrlParams } from "@olula/lib/url-params.js";
import { useLayout } from "@olula/lib/useLayout.js";
import { useEffect, useMemo } from "react";
import { ItemPedidoVenta } from "../../diseño.ts";
import { GenerarSalidaPedidoVenta } from "../generar_salida/GenerarSalidaPedidoVenta.tsx";
import { ContextoMaestroPedidoVenta } from "./diseño.ts";
import { getMaquina } from "./maquina.ts";

const metaTablaPedidoVenta: MetaTabla<ItemPedidoVenta> = [
    { id: "codigo", cabecera: "Código" },
    { id: "fecha", cabecera: "Fecha", tipo: "fecha" },
    { id: "cliente", cabecera: "Cliente" },
];

export const MaestroPedidoVenta = () => {
    const criteriaBase = useMemo(() => criteriaDefecto, []);

    const { layout, cambiarLayout } = useLayout("TABLA");

    const { id, criteria } = getUrlParams();
    const criteriaInicial = criteria.filtro.length > 0 ? criteria : criteriaBase;

    const { ctx, emitir } = useMaquina(getMaquina, {
        estado: "INICIAL",
        pedidos: listaActivaEntidadesInicial<ItemPedidoVenta>(id, criteriaInicial),
        seleccionadas: [],
    } as ContextoMaestroPedidoVenta);

    useUrlParams(ctx.pedidos.activo, ctx.pedidos.criteria);

    useEffect(() => {
        emitir("recarga_de_pedidos_solicitada", ctx.pedidos.criteria);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { estado } = ctx;

    return (
        <div className="PedidoVenta">
            <h2>Pedidos de venta</h2>
            <div className="maestro-botones">
                <span className="cambio-modo-icono" onClick={cambiarLayout}>
                    <QIcono
                        nombre={layout === "TABLA" ? "lista" : "tabla"}
                        tamaño="md"
                    />
                </span>
            </div>
            <Listado<ItemPedidoVenta>
                metaTabla={metaTablaPedidoVenta}
                criteria={ctx.pedidos.criteria}
                modo={layout === "TARJETA" ? "tarjetas" : "tabla"}
                tarjeta={TarjetaPedidoVenta}
                entidades={ctx.pedidos.lista}
                totalEntidades={ctx.pedidos.total}
                seleccionada={ctx.pedidos.activo}
                modoMultiseleccion={true}
                onMultiSeleccion={(ids) => emitir("seleccionadas_cambiadas", ids)}
                renderAcciones={() => (
                    <div className="maestro-botones">
                        {ctx.seleccionadas.length > 0 && (
                            <QBoton onClick={() => emitir("generar_salida_solicitada")}>
                                Generar salida ({ctx.seleccionadas.length})
                            </QBoton>
                        )}
                    </div>
                )}
                onSeleccion={(payload) => emitir("pedido_seleccionado", payload)}
                onCriteriaChanged={(payload) => emitir("criteria_cambiado", payload)}
                onSiguientePagina={(payload) => emitir("siguiente_pagina", payload)}
            />

            {estado === "GENERANDO_SALIDA" && (
                <GenerarSalidaPedidoVenta
                    publicar={emitir}
                    pedidoIds={ctx.seleccionadas}
                />
            )}
        </div>
    );
};

const TarjetaPedidoVenta = (pedido: ItemPedidoVenta) => {
    return (
        <div className="tarjeta-pedido-venta" key={pedido.id}>
            <div className="tarjeta-pedido-venta-codigo">{pedido.codigo}</div>
            <div className="tarjeta-pedido-venta-cliente">{pedido.cliente}</div>
        </div>
    );
};
