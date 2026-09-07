import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useForm } from "@olula/lib/useForm.ts";
import { useCallback } from "react";
import { GrupoAlbaranar } from "./maestro.ts";

const lineasPorProveedor = (grupos: GrupoAlbaranar[]): string[] =>
    grupos.map((grupo) => {
        const cuantos = `${grupo.ids.length} ${grupo.ids.length === 1 ? "pedido" : "pedidos"}`;
        return `· ${grupo.etiqueta} — ${cuantos}`;
    });

export const AlbaranarPedidos = ({
    pedidos,
    grupos,
    publicar,
}: {
    pedidos: number;
    grupos: GrupoAlbaranar[];
    publicar: EmitirEvento;
}) => {
    const albaranar_ = useCallback(
        async () => publicar("albaranado_confirmado"),
        [publicar]
    );

    const cancelar_ = useCallback(
        () => publicar("albaranado_cancelado"),
        [publicar]
    );

    const [albaranar, cancelar] = useForm(albaranar_, cancelar_);

    const cabecera = `Albaranar los ${pedidos} pedidos seleccionados. Se ${
        grupos.length === 1 ? "generará 1 albarán" : `generarán ${grupos.length} albaranes`
    }.`;

    return (
        <QModalConfirmacion
            nombre="albaranarPedidosCompra"
            abierto={true}
            titulo="Albaranar pedidos"
            mensaje={[cabecera, "", ...lineasPorProveedor(grupos)].join("\n")}
            onCerrar={cancelar}
            onAceptar={albaranar}
        />
    );
};
