import { QModalConfirmacion } from "@olula/componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { useContext } from "react";
import { Articulo } from "../../diseño";
import { deleteArticulo } from "../../infraestructura";

export const BorrarArticulo = ({
  publicar,
  activo = false,
  articulo,
}: {
  publicar: (evento: string, payload?: unknown) => void;
  articulo: Articulo;
  activo: boolean;
}) => {
  const { intentar } = useContext(ContextoError);

  const borrar = async () => {
    if (articulo.id) {
      await intentar(() => deleteArticulo(articulo.id));
    }
    publicar("articulo_borrado");
  };

  return (
    <QModalConfirmacion
      nombre="confirmarBorrarArticulo"
      abierto={activo}
      titulo="Confirmar borrado"
      mensaje="¿Está seguro de que desea borrar este módulo?"
      onCerrar={() => publicar("borrado_cancelado")}
      onAceptar={borrar}
    />
  );
};
