import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useForm } from "@olula/lib/useForm.js";
import { useCallback } from "react";
import { GrupoAlbaranar } from "./maestro.ts";

const lineasPorCliente = (grupos: GrupoAlbaranar[]): string[] => {
    const porEtiqueta = new Map<string, { pedidos: number; albaranes: number }>();

    grupos.forEach((grupo) => {
        const previo = porEtiqueta.get(grupo.etiqueta) ?? { pedidos: 0, albaranes: 0 };
        porEtiqueta.set(grupo.etiqueta, {
            pedidos: previo.pedidos + grupo.ids.length,
            albaranes: previo.albaranes + 1,
        });
    });

    return [...porEtiqueta.entries()].map(([etiqueta, { pedidos, albaranes }]) => {
        const cuantos = `${pedidos} ${pedidos === 1 ? "pedido" : "pedidos"}`;
        const reparto = albaranes > 1 ? ` en ${albaranes} albaranes` : "";
        return `· ${etiqueta} — ${cuantos}${reparto}`;
    });
};

export const AlbaranarPedidos = ({
    publicar,
    pedidos,
    grupos,
}: {
    publicar: EmitirEvento;
    pedidos: number;
    grupos: GrupoAlbaranar[];
}) => {
    const albaranar_ = useCallback(async () => {
        publicar("pedidos_albaranados");
    }, [publicar]);

    const cancelar_ = useCallback(
        () => publicar("albaranado_multiple_cancelado"),
        [publicar]
    );

    const [albaranar, cancelar] = useForm(albaranar_, cancelar_);

    const cabecera = `Albaranar los ${pedidos} pedidos seleccionados. Se ${
        grupos.length === 1 ? "generará 1 albarán" : `generarán ${grupos.length} albaranes`
    }.`;

    return (
        <QModalConfirmacion
            nombre="albaranarPedidos"
            abierto={true}
            titulo="Albaranar pedidos"
            mensaje={[cabecera, "", ...lineasPorCliente(grupos)].join("\n")}
            onCerrar={cancelar}
            onAceptar={albaranar}
        />
    );
};
