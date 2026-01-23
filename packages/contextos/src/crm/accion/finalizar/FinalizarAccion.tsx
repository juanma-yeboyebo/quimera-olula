import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useForm } from "@olula/lib/useForm.js";
import { useCallback } from "react";
import { Accion } from "../diseño.ts";
import { finalizarAccion } from "../infraestructura.ts";

export const FinalizarAccion = ({
  publicar,
  accion,
}: {
  accion: Accion;
  publicar: EmitirEvento;
}) => {
  const finalizar_ = useCallback(async () => {
    await finalizarAccion(accion.id);

    publicar("accion_finalizada", accion.id);
  }, [publicar, accion.id]);

  const cancelar_ = useCallback(
    () => publicar("finalizado_accion_cancelado"),
    [publicar]
  );

  const [finalizar, cancelar] = useForm(finalizar_, cancelar_);

  return (
    <QModalConfirmacion
      nombre="confirmarFinalizarAccion"
      abierto={true}
      titulo="Confirmar finalizado"
      mensaje={`¿Está seguro de que desea finalizar esta acción?`}
      onCerrar={cancelar}
      onAceptar={finalizar}
    />
  );
};
