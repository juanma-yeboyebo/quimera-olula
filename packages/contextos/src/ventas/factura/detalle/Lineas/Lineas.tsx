import { QuimeraAcciones } from "@olula/componentes/index.js";
import { BorrarLinea } from "../../borrar_linea/BorrarLinea.tsx";
import { CrearLinea } from "../../crear_linea/CrearLinea.tsx";
import { Factura, LineaFactura } from "../../diseño.ts";
import { EditarLinea } from "../../editar_linea/EditarLinea.tsx";
import { LineasLista } from "./LineasLista.tsx";

export const Lineas = ({
  factura,
  lineaActiva,
  estadoFactura,
  publicar,
}: {
  factura: Factura;
  lineaActiva: LineaFactura | null;
  estadoFactura: string;
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
  ];

  const handleCambioCantidad = (linea: LineaFactura, cantidad: number) => {
    publicar("cambio_cantidad_linea_solicitado", {
      lineaId: linea.id,
      cantidad: cantidad,
    });
  };

  return (
    <>
      {estadoFactura === "ABIERTO" && (
        <div className="botones maestro-botones ">
          <QuimeraAcciones acciones={acciones} />
        </div>
      )}

      <LineasLista
        lineas={factura.lineas || []}
        seleccionada={lineaActiva?.id}
        onCambioCantidad={handleCambioCantidad}
        facturaEditable={estadoFactura === "ABIERTO"}
        publicar={publicar}
      />

      {estadoFactura === "CREANDO_LINEA" && <CrearLinea publicar={publicar} />}

      {lineaActiva && estadoFactura === "CAMBIANDO_LINEA" && (
        <EditarLinea publicar={publicar} linea={lineaActiva} />
      )}

      {lineaActiva && estadoFactura === "BORRANDO_LINEA" && (
        <BorrarLinea publicar={publicar} idLinea={lineaActiva.id} />
      )}
    </>
  );
};
