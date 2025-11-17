import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { useContext } from "react";
import { Caja } from "../../diseño.ts";
import { deleteCaja } from "../../infraestructura.ts";

export const BorrarCaja = ({
  publicar,
  activo = false,
  caja,
}: {
  publicar: (evento: string, payload?: unknown) => void;
  caja: Caja;
  activo: boolean;
}) => {
  const { intentar } = useContext(ContextoError);

  const borrar = async () => {
    if (caja.id) {
      await intentar(() => deleteCaja(caja.id));
    }
    publicar("caja_borrada");
  };

  return (
    <QModalConfirmacion
      nombre="confirmarBorrarCaja"
      abierto={activo}
      titulo="Confirmar borrado"
      mensaje="¿Está seguro de que desea borrar esta caja?"
      onCerrar={() => publicar("borrado_cancelado")}
      onAceptar={borrar}
    />
  );
};
