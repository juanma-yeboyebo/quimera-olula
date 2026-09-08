import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { useForm } from "@olula/lib/useForm.js";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useCallback } from "react";
import { LineaVentaTpv } from "../diseño.ts";
import { deleteLinea } from "../infraestructura.ts";

export const BorrarLinea = ({
  ventaId,
  publicar,
  linea,
}: {
  ventaId: string;
  publicar: ProcesarEvento;
  linea: LineaVentaTpv;
}) => {
  const borrar_ = useCallback(async () => {
    await deleteLinea(ventaId, linea.id);
    publicar("linea_borrada", linea.id);
  }, [ventaId, linea, publicar]);

  const cancelar_ = useCallback(
    () => publicar("borrar_linea_cancelado"),
    [publicar]
  );

  const [borrar, cancelar] = useForm(borrar_, cancelar_);

  return (
    <QModalConfirmacion
      nombre="confirmarBorrarLinea"
      abierto={true}
      titulo="Borrar línea"
      mensaje="¿Está seguro de que desea borrar esta línea?"
      onCerrar={cancelar}
      onAceptar={borrar}
    />
  );
};
