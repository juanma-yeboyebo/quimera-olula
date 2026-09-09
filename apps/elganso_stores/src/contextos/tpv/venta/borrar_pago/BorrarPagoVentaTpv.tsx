import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { useForm } from "@olula/lib/useForm.js";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useCallback } from "react";
import { PagoVentaTpv } from "../diseño.ts";
import { deletePago } from "../infraestructura.ts";

export const BorrarPagoVentaTpv = ({
  ventaId,
  pago,
  publicar,
}: {
  ventaId: string;
  pago: PagoVentaTpv;
  publicar: ProcesarEvento;
}) => {
  const borrar_ = useCallback(async () => {
    await deletePago(ventaId, pago.id);
    publicar("pago_borrado", pago.id);
  }, [ventaId, pago.id, publicar]);

  const cancelar_ = useCallback(
    () => publicar("borrado_de_pago_cancelado"),
    [publicar]
  );

  const [borrar, cancelar] = useForm(borrar_, cancelar_);

  return (
    <QModalConfirmacion
      nombre="confirmarBorrarPago"
      abierto={true}
      titulo="Borrar pago"
      mensaje="¿Está seguro de que desea borrar este pago?"
      onCerrar={cancelar}
      onAceptar={borrar}
    />
  );
};
