import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useForm } from "@olula/lib/useForm.ts";
import { useCallback } from "react";
import { WebsiteAdmin } from "../../comun/diseño.ts";
import { ArticuloWebDetalle } from "../diseño.ts";
import { deletePublicacion } from "../infraestructura.ts";

export const BorrarPublicacionArticulo = ({
    publicar,
    articulo,
    website,
}: {
    articulo: ArticuloWebDetalle;
    website: WebsiteAdmin;
    publicar: EmitirEvento;
}) => {
    const borrar_ = useCallback(async () => {
        await deletePublicacion(articulo.referencia, website.id);
        publicar("publicacion_quitada");
    }, [publicar, articulo.referencia, website.id]);

    const cancelar_ = useCallback(() => publicar("quitar_cancelado"), [publicar]);

    const [borrar, cancelar] = useForm(borrar_, cancelar_);

    return (
        <QModalConfirmacion
            nombre="quitarPublicacionArticulo"
            abierto={true}
            titulo={`Quitar de ${website.nombre}`}
            mensaje={`¿Seguro que desea quitar ${articulo.referencia} de ${website.nombre}?`}
            onCerrar={cancelar}
            onAceptar={borrar}
        />
    );
};
