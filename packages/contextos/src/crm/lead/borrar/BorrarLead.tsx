import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { useForm } from "@olula/lib/useForm.js";
import { useCallback } from "react";
import { Lead } from "../diseño.ts";
import { deleteLead } from "../infraestructura.ts";

export const BorrarLead = ({
  publicar,
  lead,
}: {
  lead: Lead;
  publicar: EmitirEvento;
}) => {
  const borrar_ = useCallback(async () => {
    await deleteLead(lead.id);

    publicar("lead_borrado", lead.id);
  }, [publicar, lead.id]);

  const cancelar_ = useCallback(
    () => publicar("borrado_lead_cancelado"),
    [publicar]
  );

  const [borrar, cancelar] = useForm(borrar_, cancelar_);

  return (
    <QModalConfirmacion
      nombre="borrarlead"
      abierto={true}
      titulo="Borrar lead"
      mensaje={`¿Está seguro de que desea borrar este lead?`}
      onCerrar={cancelar}
      onAceptar={borrar}
    />
  );
};
