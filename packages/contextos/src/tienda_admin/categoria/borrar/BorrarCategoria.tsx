import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useForm } from "@olula/lib/useForm.ts";
import { useCallback } from "react";
import { NodoCategoria } from "../diseño.ts";
import { deleteCategoria } from "../infraestructura.ts";

export const BorrarCategoria = ({
    publicar,
    categoria,
}: {
    categoria: NodoCategoria;
    publicar: EmitirEvento;
}) => {
    const borrar_ = useCallback(async () => {
        await deleteCategoria(categoria.id);
        publicar("categoria_borrada", categoria);
    }, [publicar, categoria]);

    const cancelar_ = useCallback(() => publicar("borrado_cancelado"), [publicar]);

    const [borrar, cancelar] = useForm(borrar_, cancelar_);

    return (
        <QModalConfirmacion
            nombre="borrarCategoria"
            abierto={true}
            titulo="Borrar categoría"
            mensaje={`¿Está seguro de que desea borrar la categoría ${categoria.nombre}?`}
            onCerrar={cancelar}
            onAceptar={borrar}
        />
    );
};
