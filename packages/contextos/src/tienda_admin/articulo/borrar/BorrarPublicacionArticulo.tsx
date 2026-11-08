import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useForm } from "@olula/lib/useForm.ts";
import { useCallback } from "react";
import { ArticuloWebDetalle } from "../diseño.ts";
import { deletePublicacion } from "../infraestructura.ts";

export const BorrarPublicacionArticulo = ({
    publicar,
    articulo,
    websiteId,
    nombreWebsite,
}: {
    articulo: ArticuloWebDetalle;
    websiteId: number;
    nombreWebsite: string | null;
    publicar: EmitirEvento;
}) => {
    const borrar_ = useCallback(async () => {
        await deletePublicacion(articulo.referencia, websiteId);
        publicar("publicacion_quitada");
    }, [publicar, articulo.referencia, websiteId]);

    const cancelar_ = useCallback(() => publicar("quitar_cancelado"), [publicar]);

    const [borrar, cancelar] = useForm(borrar_, cancelar_);

    return (
        <QModalConfirmacion
            nombre="quitarPublicacionArticulo"
            abierto={true}
            titulo="Quitar de la tienda"
            mensaje={`¿Seguro que desea quitar ${articulo.referencia} de ${nombreWebsite ?? "la tienda"}?`}
            onCerrar={cancelar}
            onAceptar={borrar}
        />
    );
};
