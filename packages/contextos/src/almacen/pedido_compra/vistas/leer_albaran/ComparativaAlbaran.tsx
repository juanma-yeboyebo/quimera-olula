import { Ubicacion } from "#/almacen/comun/componentes/Ubicacion.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QModal } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useForm } from "@olula/lib/useForm.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback } from "react";
import { LineaNuevaEntradaDesdePedido, LineaPedidoCompra, LoteLineaNuevaEntradaDesdePedido } from "../../diseño.ts";
import { postEntradaDesdePedido } from "../../infraestructura.ts";
import {
    formEntradaVacia,
    metaFormEntrada,
} from "../crear_entrada_desde_pedido/crear_entrada_desde_pedido.ts";
import "./ComparativaAlbaran.css";

const formatoFecha = (fecha: Date) => {
    const d = fecha.getDate().toString().padStart(2, "0");
    const m = (fecha.getMonth() + 1).toString().padStart(2, "0");
    return `${d}/${m}/${fecha.getFullYear()}`;
};

const FilaLote = ({ lote }: { lote: LoteLineaNuevaEntradaDesdePedido }) => (
    <tr className="comparativa-lote">
        <td></td>
        <td className="comparativa-lote-label">
            Lote {lote.lote ?? lote.id}
            {lote.caducidad && ` — cad. ${formatoFecha(lote.caducidad)}`}
        </td>
        <td></td>
        <td className="comparativa-cantidad">{lote.cantidad}</td>
        <td></td>
    </tr>
);

const FilaLinea = ({
    linea,
    detectada,
}: {
    linea: LineaPedidoCompra;
    detectada?: LineaNuevaEntradaDesdePedido;
}) => {
    const pendiente = linea.cantidad - linea.cantidadRecibida;
    const cantidadDetectada = detectada?.cantidad ?? 0;
    const diferencia = cantidadDetectada - pendiente;

    const claseDiferencia =
        diferencia < 0
            ? "comparativa-faltan"
            : diferencia > 0
              ? "comparativa-sobran"
              : "";

    return (
        <>
            <tr>
                <td>{linea.sku}</td>
                <td>{linea.descripcion}</td>
                <td className="comparativa-cantidad">{pendiente}</td>
                <td className="comparativa-cantidad">{cantidadDetectada}</td>
                <td className={`comparativa-cantidad ${claseDiferencia}`}>
                    {diferencia > 0 ? `+${diferencia}` : diferencia}
                </td>
            </tr>
            {detectada?.lotes?.map((lote, i) => (
                <FilaLote key={i} lote={lote} />
            ))}
        </>
    );
};

export const ComparativaAlbaran = ({
    publicar,
    pedidoCompraId,
    lineasPedido,
    lineasDetectadas,
}: {
    publicar: EmitirEvento;
    pedidoCompraId: string;
    lineasPedido: LineaPedidoCompra[];
    lineasDetectadas: LineaNuevaEntradaDesdePedido[];
}) => {
    const { modelo, uiProps, valido } = useModelo(
        metaFormEntrada,
        formEntradaVacia
    );

    const detectadasPorId = new Map(
        lineasDetectadas.map((l) => [l.id, l])
    );

    const crear_ = useCallback(
        async () => {
            const id = await postEntradaDesdePedido({
                pedidoCompraId,
                ubicacionId: modelo.ubicacionId,
                lineas: lineasDetectadas,
            });
            publicar("entrada_creada", id);
        },
        [modelo.ubicacionId, pedidoCompraId, lineasDetectadas, publicar]
    );

    const cancelar_ = useCallback(
        () => publicar("leer_albaran_cancelado"),
        [publicar]
    );

    const [crear, cancelar] = useForm(crear_, cancelar_);

    return (
        <QModal
            abierto={true}
            nombre="comparativaAlbaran"
            titulo="Comparativa de albarán"
            onCerrar={cancelar}
        >
            <div className="comparativa-albaran">
                <table className="comparativa-tabla">
                    <thead>
                        <tr>
                            <th>SKU</th>
                            <th>Descripción</th>
                            <th>Por recibir</th>
                            <th>Detectado</th>
                            <th>Diferencia</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lineasPedido.map((linea) => (
                            <FilaLinea
                                key={linea.id}
                                linea={linea}
                                detectada={detectadasPorId.get(linea.id)}
                            />
                        ))}
                    </tbody>
                </table>

                <quimera-formulario>
                    <Ubicacion label="Ubicación de entrada" {...uiProps("ubicacionId")} />
                </quimera-formulario>
            </div>

            <div className="botones maestro-botones">
                <QBoton onClick={crear} deshabilitado={!valido}>
                    Crear entrada
                </QBoton>
                <QBoton onClick={cancelar}>
                    Cancelar
                </QBoton>
            </div>
        </QModal>
    );
};
