import { QAvatar, QTarjetaGenerica } from "@olula/componentes/index.js";
import { Articulo } from "../diseño.ts";

export const TarjetaArticulo = (articulo: Articulo) => (
  <QTarjetaGenerica
    avatar={<QAvatar nombre={articulo.descripcion} />}
    arribaIzquierda={articulo.descripcion}
    abajoIzquierda={articulo.id}
    abajoDerecha={articulo.codImpuesto}
  />
);
