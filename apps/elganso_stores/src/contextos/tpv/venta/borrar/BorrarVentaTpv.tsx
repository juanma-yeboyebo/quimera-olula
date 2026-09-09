import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { useForm } from "@olula/lib/useForm.js";
import { useCallback } from "react";
import { VentaTpv } from "../diseño.ts";
import { borrarVenta } from "../infraestructura.ts";

export const BorrarVentaTpv = ({
  publicar,
  venta,
}: {
  publicar: (evento: string, payload?: unknown) => void;
  venta: VentaTpv;
}) => {
  const borrar_ = useCallback(async () => {
    if (venta.id) {
      await borrarVenta(venta.id);
    }
    publicar("borrado_de_venta_listo");
  }, [venta.id, publicar]);

  const cancelar_ = useCallback(
    () => publicar("borrar_cancelado"),
    [publicar]
  );

  const [borrar, cancelar] = useForm(borrar_, cancelar_);

  return (
    <QModalConfirmacion
      nombre="confirmarBorrarVentaTpv"
      abierto={true}
      titulo="Confirmar borrar"
      mensaje="¿Está seguro de que desea borrar esta venta?"
      onCerrar={cancelar}
      onAceptar={borrar}
    />
  );
};
