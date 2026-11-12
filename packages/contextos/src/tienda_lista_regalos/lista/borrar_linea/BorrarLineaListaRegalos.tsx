import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useForm } from "@olula/lib/useForm.ts";
import { useCallback } from "react";
import { LineaListaRegalos, ListaRegalos } from "../diseño.ts";
import { deleteLineaListaRegalos } from "../infraestructura.ts";

export const BorrarLineaListaRegalos = ({
    lista,
    linea,
    publicar,
}: {
    lista: ListaRegalos;
    linea: LineaListaRegalos;
    publicar: EmitirEvento;
}) => {
    const borrar_ = useCallback(
        async () => {
            await deleteLineaListaRegalos(lista.id, linea.id);
            publicar("linea_borrada", linea.id);
        },
        [lista.id, linea, publicar]
    );

    const cancelar_ = useCallback(
        () => publicar("borrado_de_linea_cancelado"),
        [publicar]
    );

    const [borrar, cancelar] = useForm(borrar_, cancelar_);

    return (
        <QModalConfirmacion
            nombre="confirmarBorrarLineaListaRegalos"
            abierto={true}
            titulo="Borrar producto"
            mensaje={`¿Está seguro de que desea borrar "${linea.referencia} · ${linea.descripcion}" de la lista?`}
            onCerrar={cancelar}
            onAceptar={borrar}
        />
    );
};
