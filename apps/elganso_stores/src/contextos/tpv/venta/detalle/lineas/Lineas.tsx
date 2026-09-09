import { AnadirBolsas } from "../../anadir_bolsas/AnadirBolsas.tsx";
import { BorrarLinea } from "../../borrar_linea/BorrarLinea.tsx";
import { CrearLinea } from "../../crear_linea/CrearLinea.tsx";
import { LineaVentaTpv, VentaTpv } from "../../diseño.ts";
import { CambiarLinea } from "../../cambiar_linea/CambiarLinea.tsx";
import { LineasLista } from "./LineasLista.tsx";
import "./Lineas.scss";

export const Lineas = ({
  venta,
  lineaActiva,
  estadoVenta,
  ventaEditable,
  publicar,
}: {
  venta: VentaTpv;
  lineaActiva: LineaVentaTpv | null;
  estadoVenta: string;
  ventaEditable: boolean;
  publicar: (evento: string, payload?: unknown) => void;
}) => {
  const acciones = [
    {
      texto: "Nueva",
      onClick: () => publicar("alta_linea_solicitada"),
    },
    {
      texto: "Editar",
      onClick: () => publicar("cambio_linea_solicitado"),
      deshabilitado: !lineaActiva,
    },
    {
      icono: "eliminar",
      texto: "Borrar",
      advertencia: true,
      onClick: () => publicar("baja_linea_solicitada"),
      deshabilitado: !lineaActiva,
    },
    {
      icono: "bolsa",
      texto: "Bolsas",
      onClick: () => publicar("bolsas_solicitadas"),
    },
  ];

  const handleCambioCantidad = (linea: LineaVentaTpv, cantidad: number) => {
    publicar("cambio_cantidad_linea_solicitado", {
      lineaId: linea.id,
      cantidad: cantidad,
    });
  };

  return (
    <>
      <h3 className="Lineas-titulo">Líneas de venta</h3>

      <LineasLista
        key={venta.id}
        ventaId={venta.id}
        lineas={venta.lineas || []}
        seleccionada={lineaActiva?.id}
        onCambioCantidad={handleCambioCantidad}
        divisa={venta.divisa_id}
        ventaEditable={estadoVenta === "ABIERTO" && ventaEditable}
        acciones={
          estadoVenta === "ABIERTO" && ventaEditable ? acciones : undefined
        }
        publicar={publicar}
      />

      {estadoVenta === "CREANDO_LINEA" && (
        <CrearLinea ventaId={venta.id} publicar={publicar} />
      )}

      {estadoVenta === "AÑADIENDO_BOLSAS" && (
        <AnadirBolsas ventaId={venta.id} lineas={venta.lineas || []} publicar={publicar} />
      )}

      {lineaActiva && estadoVenta === "CAMBIANDO_LINEA" && (
        <CambiarLinea
          ventaId={venta.id}
          publicar={publicar}
          linea={lineaActiva}
        />
      )}

      {lineaActiva && estadoVenta === "BORRANDO_LINEA" && (
        <BorrarLinea
          ventaId={venta.id}
          publicar={publicar}
          linea={lineaActiva}
        />
      )}
    </>
  );
};
