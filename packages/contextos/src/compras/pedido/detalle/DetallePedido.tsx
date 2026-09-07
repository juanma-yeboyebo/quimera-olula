import { CambiarDivisa } from "#/ventas/comun/componentes/moleculas/CambiarDivisa/CambiarDivisa.tsx";
import { CambioProveedor } from "#/compras/comun/componentes/moleculas/CambioProveedor/CambioProveedor.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "@olula/componentes/detalle/tabs/Tabs.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { QuimeraAcciones } from "@olula/componentes/moleculas/qacciones.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { imprimir_blob } from "@olula/lib/impresion.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useEffect } from "react";
import { BorrarPedido } from "../borrar/BorrarPedido.tsx";
import { Pedido } from "../diseño.ts";
import { pedidoPendiente } from "../dominio.ts";
import { getReportPedido } from "../infraestructura.ts";
import {
    contextoDetallePedidoInicial,
    guardarPedido,
    metaPedido,
} from "./detalle.ts";
import "./DetallePedido.css";
import { LineasPedido } from "./lineas/LineasPedido.tsx";
import { getMaquina } from "./maquina.ts";
import { TabDatos } from "./TabDatos.tsx";
import { TabProveedor } from "./TabProveedor.tsx";
import { TotalesPedido } from "./TotalesPedido.tsx";
import { TabObservaciones } from "./TabObservaciones.tsx";

export const DetallePedido = ({
    id,
    publicar = async () => {},
}: {
    id?: string;
    publicar?: EmitirEvento;
}) => {
    const { ctx, emitir } = useMaquina(getMaquina, contextoDetallePedidoInicial, publicar);

    const autoGuardar = useCallback(
        async (pedido: Pedido) => {
            await guardarPedido(ctx, pedido);
            await emitir("pedido_guardado");
        },
        [ctx, emitir]
    );

    const formModelo = useModelo(metaPedido, ctx.pedido, autoGuardar);

    const { estado, pedido, lineas } = ctx;

    useEffect(() => {
        emitir("pedido_id_cambiado", id, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (!pedido.id) return null;

    const titulo = (p: Pedido) =>
        `${p.codigo}${p.nombreProveedor ? ` · ${p.nombreProveedor}` : ""}`;

    const imprimir = async () => {
        const blob = await getReportPedido(pedido.id);
        imprimir_blob(blob);
    };

    const accionesPedido = [
        { texto: "Imprimir", onClick: imprimir },
        {
            icono: "eliminar",
            texto: "Borrar",
            onClick: () => emitir("borrado_solicitado"),
            advertencia: true,
            deshabilitado: !pedidoPendiente(pedido),
        },
    ];

    return (
        <Detalle
            id={id}
            obtenerTitulo={titulo}
            setEntidad={() => {}}
            entidad={pedido}
            cerrarDetalle={() => emitir("pedido_deseleccionado", null, true)}
        >
            <div className="DetallePedido">
                <div className="maestro-botones">
                    <QuimeraAcciones acciones={accionesPedido} vertical />
                </div>
                <Tabs
                    children={[
                        <Tab
                            key="tab-proveedor"
                            label="Proveedor"
                            children={<TabProveedor form={formModelo} publicar={emitir} />}
                        />,
                        <Tab
                            key="tab-datos"
                            label="Datos"
                            children={<TabDatos form={formModelo} publicar={emitir} />}
                        />,
                        <Tab
                            key="tab-observaciones"
                            label="Observaciones"
                            children={<TabObservaciones form={formModelo} />}
                        />,
                    ]}
                />
                <TotalesPedido form={formModelo} />
                <LineasPedido
                    pedido={pedido}
                    lineas={lineas}
                    estado={estado}
                    publicar={emitir}
                />
            </div>

            {estado === "CAMBIANDO_DIVISA" && (
                <CambiarDivisa
                    publicar={emitir}
                    divisaId={pedido.divisaId}
                    tasaConversion={pedido.tasaConversion}
                />
            )}

            {estado === "CAMBIANDO_PROVEEDOR" && (
                <CambioProveedor
                    documento={pedido}
                    onGuardar={async (cambio) => emitir("cambio_proveedor_listo", cambio)}
                    onCancelar={() => emitir("cambio_proveedor_cancelado")}
                />
            )}

            {estado === "BORRANDO" && (
                <BorrarPedido pedido={pedido} publicar={emitir} />
            )}
        </Detalle>
    );
};
