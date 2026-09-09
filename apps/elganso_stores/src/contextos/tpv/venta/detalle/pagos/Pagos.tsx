import { PagoVentaTpv } from "../../diseño.ts";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { PagosLista } from "./PagosLista.tsx";

export const Pagos = ({
  pagos,
  pagoActivo,
  publicar = async () => {},
}: {
  pagos: PagoVentaTpv[];
  pagoActivo: PagoVentaTpv | null;
  publicar?: EmitirEvento;
}) => {
  const acciones = pagoActivo?.arqueoAbierto
    ? [
        {
          icono: "eliminar",
          texto: "Borrar",
          advertencia: true,
          onClick: () => publicar("borrar_pago_solicitado"),
        },
      ]
    : [];

  return (
    <PagosLista
      pagos={pagos}
      pagoActivo={pagoActivo}
      acciones={acciones}
      publicar={publicar}
    />
  );
};
