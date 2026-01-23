import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useForm } from "@olula/lib/useForm.js";
import { useCallback } from "react";
import { Accion } from "../diseño.ts";
import { deleteAccion } from "../infraestructura.ts";

export const BorrarAccion = ({
  publicar,
  accion,
}: {
  accion: Accion;
  publicar: EmitirEvento;
}) => {
  const borrar_ = useCallback(async () => {
    await deleteAccion(accion.id);

    publicar("accion_borrada", accion.id);
  }, [publicar, accion.id]);

  const cancelar_ = useCallback(
    () => publicar("borrado_accion_cancelado"),
    [publicar]
  );

  const [borrar, cancelar] = useForm(borrar_, cancelar_);

  return (
    <QModalConfirmacion
      nombre="confirmarBorrarAccion"
      abierto={true}
      titulo="Confirmar borrado"
      mensaje={`¿Está seguro de que desea borrar esta acción?`}
      onCerrar={cancelar}
      onAceptar={borrar}
    />
  );
};
