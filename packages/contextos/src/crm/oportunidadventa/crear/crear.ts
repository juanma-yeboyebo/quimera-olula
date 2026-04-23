import { MetaModelo, stringNoVacio } from "@olula/lib/dominio.js";
import { NuevaOportunidadVenta } from "./diseño.ts";

export const nuevaOportunidadVentaVacia: NuevaOportunidadVenta = {
    descripcion: '',
    importe: 0,
    cliente_id: '',
    contacto_id: '',
    tarjeta_id: '',
};

export const metaNuevaOportunidadVenta: MetaModelo<NuevaOportunidadVenta> = {
    campos: {
        descripcion: { requerido: true, validacion: (oportunidad: NuevaOportunidadVenta) => stringNoVacio(oportunidad.descripcion) },
        nombre_cliente: { requerido: true, validacion: (oportunidad: NuevaOportunidadVenta) => stringNoVacio(oportunidad.descripcion) },
        importe: { requerido: false, tipo: "moneda" },
        cliente_id: { requerido: false, tipo: "autocompletar" },
    },
};