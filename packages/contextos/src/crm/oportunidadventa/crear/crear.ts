import { MetaModelo, stringNoVacio } from "@olula/lib/dominio.js";
import { NuevaOportunidadVenta } from "./diseño.ts";

const onChangeNuevaOportunidad = (nueva_oportunidad: NuevaOportunidadVenta, campo: string, _: unknown, otros?: Record<string, unknown>) => {
    if (campo === "estado_id" && otros) {
        return {
            ...nueva_oportunidad,
            probabilidad: otros.probabilidad as number
        }
    }
    return nueva_oportunidad;
}

export const nuevaOportunidadVentaVacia: NuevaOportunidadVenta = {
    descripcion: '',
    probabilidad: 0,
    estado_id: undefined,
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
        probabilidad: { requerido: true, tipo: "numero" },
        estado_id: { requerido: true, tipo: "selector" },
        cliente_id: { requerido: false, tipo: "autocompletar" },
    },
    onChange: onChangeNuevaOportunidad
};