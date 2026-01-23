import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useForm } from "@olula/lib/useForm.js";
import { useCallback } from "react";
import { Contacto } from "../diseño.ts";
import { deleteContacto } from "../infraestructura.ts";

export const BorrarContacto = ({
  publicar,
  contacto,
}: {
  contacto: Contacto;
  publicar: EmitirEvento;
}) => {
  const borrar_ = useCallback(async () => {
    await deleteContacto(contacto.id);

    publicar("contacto_borrado", contacto.id);
  }, [publicar, contacto.id]);

  const cancelar_ = useCallback(
    () => publicar("borrado_contacto_cancelado"),
    [publicar]
  );

  const [borrar, cancelar] = useForm(borrar_, cancelar_);

  return (
    <QModalConfirmacion
      nombre="borrarContacto"
      abierto={true}
      titulo="Borrar contacto"
      mensaje={`¿Está seguro de que desea borrar este contacto?`}
      onCerrar={cancelar}
      onAceptar={borrar}
    />
  );
};
