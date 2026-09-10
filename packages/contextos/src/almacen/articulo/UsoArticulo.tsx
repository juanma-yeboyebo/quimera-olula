import { QEtiqueta } from "@olula/componentes/atomos/qetiqueta.tsx";
import { Articulo } from "./diseño.ts";

export const UsoArticulo = (articulo: Articulo) => (
  <>
    <QEtiqueta variante={articulo.seVende ? "exito" : "advertencia"}>
      Venta
    </QEtiqueta>{" "}
    <QEtiqueta variante={articulo.seCompra ? "exito" : "advertencia"}>
      Compra
    </QEtiqueta>{" "}
    {articulo.noStock && <QEtiqueta variante="error">Sin stock</QEtiqueta>}
  </>
);
