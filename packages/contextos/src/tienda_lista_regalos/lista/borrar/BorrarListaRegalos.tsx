import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useForm } from "@olula/lib/useForm.ts";
import { useCallback } from "react";
import { ListaRegalos } from "../diseño.ts";
import { deleteListaRegalos } from "../infraestructura.ts";

export const BorrarListaRegalos = ({
    publicar,
    lista,
}: {
    lista: ListaRegalos;
    publicar: EmitirEvento;
}) => {
    const borrar_ = useCallback(
        async () => {
            await deleteListaRegalos(lista.id);
            publicar("lista_borrada", lista);
        },
        [publicar, lista]
    );

    const cancelar_ = useCallback(
        () => publicar("borrado_cancelado"),
        [publicar]
    );

    const [borrar, cancelar] = useForm(borrar_, cancelar_);

    return (
        <QModalConfirmacion
            nombre="borrarListaRegalos"
            abierto={true}
            titulo="Borrar lista"
            mensaje={`¿Está seguro de que desea borrar la lista ${lista.nombre}?`}
            onCerrar={cancelar}
            onAceptar={borrar}
        />
    );
};
