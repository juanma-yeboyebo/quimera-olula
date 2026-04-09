import { QuimeraAcciones } from "@olula/componentes/index.js";
import { BorrarLinea } from "../../borrar_linea/BorrarLinea.tsx";
import { CrearLinea } from "../../crear_linea/CrearLinea.tsx";
import { Albaran, LineaAlbaran } from "../../diseño.ts";
import { EditarLinea } from "../../editar_linea/EditarLinea.tsx";
import { LineasLista } from "./LineasLista.tsx";

export const Lineas = ({
  albaran,
  lineaActiva,
  estadoAlbaran,
  publicar,
}: {
  albaran: Albaran;
  lineaActiva: LineaAlbaran | null;
  estadoAlbaran: string;
  publicar: (evento: string, payload?: unknown) => void;
}) => {
  const handleCambioCantidad = (linea: LineaAlbaran, cantidad: number) => {
    publicar("cambio_cantidad_linea_solicitado", {
      lineaId: linea.id,
      cantidad: cantidad,
    });
  };

  const esEditable = estadoAlbaran === "ABIERTO" && !albaran.idfactura;
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

  return (
    <>
      {esEditable && (
        <div className="botones maestro-botones ">
          <QuimeraAcciones acciones={acciones} />
        </div>
      )}

      <LineasLista
        lineas={albaran.lineas || []}
        seleccionada={lineaActiva?.id}
        onCambioCantidad={handleCambioCantidad}
        albaranEditable={esEditable}
        publicar={publicar}
      />

      {estadoAlbaran === "CREANDO_LINEA" && (
        <CrearLinea albaranId={albaran.id} publicar={publicar} />
      )}

      {lineaActiva && estadoAlbaran === "CAMBIANDO_LINEA" && (
        <EditarLinea
          publicar={publicar}
          linea={lineaActiva}
          albaranId={albaran.id}
        />
      )}

      {lineaActiva && estadoAlbaran === "BORRANDO_LINEA" && (
        <BorrarLinea
          publicar={publicar}
          idLinea={lineaActiva.id}
          albaranId={albaran.id}
        />
      )}
    </>
  );
};
