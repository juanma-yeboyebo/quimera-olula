import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useForm } from "@olula/lib/useForm.ts";
import { useCallback } from "react";
import { ArticuloProveedor } from "../diseño.ts";
import { deleteArticuloProveedor } from "../infraestructura.ts";

export const BorrarArticuloProveedor = ({
  precio,
  publicar,
}: {
  precio: ArticuloProveedor;
  publicar: EmitirEvento;
}) => {
  const borrar_ = useCallback(async () => {
    await deleteArticuloProveedor(precio.id);
    publicar("precio_borrado", precio.id);
  }, [precio.id, publicar]);

  const cancelar_ = useCallback(
    () => publicar("borrado_de_precio_cancelado"),
    [publicar]
  );

  const [borrar, cancelar] = useForm(borrar_, cancelar_);

  return (
    <QModalConfirmacion
      nombre="confirmarBorrarArticuloProveedor"
      abierto={true}
      titulo="Borrar proveedor del artículo"
      mensaje={`¿Está seguro de que desea quitar a "${precio.proveedor}" de este artículo?`}
      onCerrar={cancelar}
      onAceptar={borrar}
    />
  );
};
