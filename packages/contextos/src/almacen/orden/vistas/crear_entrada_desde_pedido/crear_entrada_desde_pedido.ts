import { MetaModelo, stringNoVacio } from "@olula/lib/dominio.js";
import { NuevaEntradaDesdePedido } from "../../diseño.ts";

export const metaEntradaDesdePedido: MetaModelo<NuevaEntradaDesdePedido> = {
    campos: {
        pedidoCompraId: { requerido: true, validacion: (m) => stringNoVacio(m.pedidoCompraId) },
        ubicacionId:    { requerido: true, validacion: (m) => stringNoVacio(m.ubicacionId) },
    },
};

export const entradaDesdePedidoVacia: NuevaEntradaDesdePedido = {
    pedidoCompraId: "",
    ubicacionId: "",
};
