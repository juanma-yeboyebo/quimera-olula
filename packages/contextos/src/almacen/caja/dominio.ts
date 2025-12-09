import { MetaTabla } from "@olula/componentes/index.js";
import { MetaModelo, stringNoVacio } from "@olula/lib/dominio.ts";
import { Caja, MovimientoCaja, NuevaCaja } from "./diseño";

export const cajaVacia: Caja = {
    id: "",
    codigo_almacen: "",
};

export const metaCaja: MetaModelo<Caja> = {
    campos: {
        codigo_almacen: { requerido: true, validacion: (m: Caja) => stringNoVacio(m.codigo_almacen) },
    },
};

// export const nuevaCajaVacia: Partial<Caja> = {
export const nuevaCajaVacia: NuevaCaja = {
    id: "",
    codigo_almacen: "",
};

export const metaNuevaCaja: MetaModelo<Partial<Caja>> = {
    campos: {
        codigo_almacen: { requerido: true, validacion: (m) => stringNoVacio(m.codigo_almacen || "") },
    },
};

export const metaTablaCaja: MetaTabla<Caja> = [
    { id: "id", cabecera: "Código Caja" },
    { id: "codigo_almacen", cabecera: "Descripcion" },
];

export const metaTablaMovimientosCaja: MetaTabla<MovimientoCaja> = [
    { id: "sku", cabecera: "Referencia" },
    { id: "descripcion", cabecera: "Descripción" },
    { id: "cantidad", cabecera: "Cantidad", tipo: "numero" },
];
