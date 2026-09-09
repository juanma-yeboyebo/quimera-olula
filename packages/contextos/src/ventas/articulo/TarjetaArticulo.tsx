import { QAvatar, QEtiqueta, QTarjetaGenerica } from "@olula/componentes/index.js";
import { formatearMoneda } from "@olula/lib/dominio.ts";
import { Articulo } from "./diseño.ts";

export const TarjetaArticulo = (articulo: Articulo) => {
  return (
    <QTarjetaGenerica
      avatar={<QAvatar nombre={articulo.descripcion} />}
      arribaIzquierda={articulo.descripcion}
      arribaDerecha={
        <>
          {articulo.pvpVariable && (
            <QEtiqueta variante="advertencia">PVP variable</QEtiqueta>
          )}
          {articulo.noStock && (
            <QEtiqueta variante="primario">Sin stock</QEtiqueta>
          )}
        </>
      }
      abajoIzquierda={[articulo.id, articulo.codbarras]
        .filter(Boolean)
        .join(" · ")}
      abajoDerecha={formatearMoneda(articulo.precio, "EUR")}
    />
  );
};
