import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useForm } from "@olula/lib/useForm.js";
import { useCallback } from "react";

export const FacturarPedidos = ({
    publicar,
    pedidos,
}: {
    publicar: EmitirEvento;
    pedidos: number;
}) => {
    const facturar_ = useCallback(async () => {
        publicar("pedidos_facturados");
    }, [publicar]);

    const cancelar_ = useCallback(
        () => publicar("facturado_multiple_cancelado"),
        [publicar]
    );

    const [facturar, cancelar] = useForm(facturar_, cancelar_);

    const mensaje = pedidos === 1
        ? "Se generará y emitirá la factura del pedido seleccionado. Después ya no se podrá modificar el pedido."
        : `Se generará y emitirá una factura por cada uno de los ${pedidos} pedidos seleccionados. Después ya no se podrán modificar los pedidos.`;

    return (
        <QModalConfirmacion
            nombre="facturarPedidos"
            abierto={true}
            titulo="Facturar pedidos"
            mensaje={mensaje}
            onCerrar={cancelar}
            onAceptar={facturar}
        />
    );
};
