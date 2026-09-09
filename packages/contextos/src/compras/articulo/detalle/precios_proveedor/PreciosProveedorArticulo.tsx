import { EmitirEvento } from "@olula/lib/diseño.ts";
import { ListaEntidades } from "@olula/lib/ListaEntidades.ts";
import { BorrarArticuloProveedor } from "../../../articulo_proveedor/borrar/BorrarArticuloProveedor.tsx";
import { CambiarArticuloProveedor } from "../../../articulo_proveedor/cambiar/CambiarArticuloProveedor.tsx";
import { CrearArticuloProveedor } from "../../../articulo_proveedor/crear/CrearArticuloProveedor.tsx";
import { ArticuloProveedor } from "../../../articulo_proveedor/diseño.ts";
import { Articulo } from "../../diseño.ts";
import { EstadoDetalleArticulo } from "../diseño.ts";
import { PreciosProveedorLista } from "./PreciosProveedorLista.tsx";

export const PreciosProveedorArticulo = ({
  articulo,
  precios,
  estado,
  publicar,
}: {
  articulo: Articulo;
  precios: ListaEntidades<ArticuloProveedor>;
  estado: EstadoDetalleArticulo;
  publicar: EmitirEvento;
}) => {
  const activo = precios.activo;

  return (
    <>
      <PreciosProveedorLista
        precios={precios.lista}
        seleccionada={activo}
        publicar={publicar}
      />
      {estado === "CREANDO_PRECIO" && (
        <CrearArticuloProveedor articuloId={articulo.id} publicar={publicar} />
      )}
      {activo && estado === "CAMBIANDO_PRECIO" && (
        <CambiarArticuloProveedor precio={activo} publicar={publicar} />
      )}
      {activo && estado === "BORRANDO_PRECIO" && (
        <BorrarArticuloProveedor precio={activo} publicar={publicar} />
      )}
    </>
  );
};
