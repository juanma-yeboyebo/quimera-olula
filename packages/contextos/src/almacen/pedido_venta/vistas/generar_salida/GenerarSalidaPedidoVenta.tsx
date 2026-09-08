import { Ubicacion } from "#/almacen/comun/componentes/Ubicacion.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QModal } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useForm } from "@olula/lib/useForm.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback } from "react";
import { generarSalidaDesdePedidos } from "../../infraestructura.ts";
import { generarSalidaVacia, metaGenerarSalida } from "./generar_salida.ts";

export const GenerarSalidaPedidoVenta = ({
    publicar,
    pedidoIds,
}: {
    publicar: EmitirEvento;
    pedidoIds: string[];
}) => {
    const { modelo, uiProps, valido } = useModelo(metaGenerarSalida, generarSalidaVacia);

    const generar_ = useCallback(async () => {
        const ids = pedidoIds.map((id) => parseInt(id, 10));
        const ubicacionId = parseInt(modelo.ubicacionDestinoId as string, 10);
        await generarSalidaDesdePedidos(ids, ubicacionId);
        publicar("salida_generada");
    }, [modelo.ubicacionDestinoId, pedidoIds, publicar]);

    const cancelar_ = useCallback(() => publicar("salida_cancelada"), [publicar]);

    const [generar, cancelar] = useForm(generar_, cancelar_);

    return (
        <QModal
            abierto={true}
            nombre="generarSalidaPedidoVenta"
            titulo={`Generar salida (${pedidoIds.length} pedido${pedidoIds.length !== 1 ? "s" : ""})`}
            onCerrar={cancelar}
        >
            <quimera-formulario>
                <Ubicacion label="Ubicación de preparación" {...uiProps("ubicacionDestinoId")} />
            </quimera-formulario>

            <div className="botones maestro-botones">
                <QBoton onClick={generar} deshabilitado={!valido}>
                    Generar salida
                </QBoton>
            </div>
        </QModal>
    );
};
