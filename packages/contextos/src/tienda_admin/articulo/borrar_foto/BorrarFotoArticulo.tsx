import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useForm } from "@olula/lib/useForm.ts";
import { useCallback } from "react";
import { ArticuloWebDetalle, ImagenArticulo } from "../diseño.ts";
import { deleteImagenArticulo } from "../infraestructura.ts";

export const BorrarFotoArticulo = ({
    publicar,
    articulo,
    foto,
}: {
    articulo: ArticuloWebDetalle;
    foto: ImagenArticulo;
    publicar: EmitirEvento;
}) => {
    const borrar_ = useCallback(async () => {
        await deleteImagenArticulo(articulo.referencia, foto.id);
        publicar("foto_borrada");
    }, [publicar, articulo.referencia, foto.id]);

    const cancelar_ = useCallback(() => publicar("borrado_foto_cancelado"), [publicar]);

    const [borrar, cancelar] = useForm(borrar_, cancelar_);

    return (
        <QModalConfirmacion
            nombre="borrarFotoArticulo"
            abierto={true}
            titulo="Borrar foto"
            mensaje={`¿Seguro que desea borrar esta foto de ${articulo.referencia}?`}
            onCerrar={cancelar}
            onAceptar={borrar}
        />
    );
};
