import { VentaTpv } from "#/tpv/venta/diseño.ts";
import { Modelo } from "@olula/lib/diseño.js";
import { MetaModelo } from "@olula/lib/dominio.js";

export type ModeloClienteVentaRegistrado = {
    idCliente: string,
    idDireccion: string,
    nombre: string,
}

export interface ModeloClienteVentaNoRegistrado extends Modelo {
    nombre: string;
    idFiscal: string;
    nombreVia: string;
    tipoVia?: string;
    numero?: string;
    otros?: string;
    codPostal: string;
    ciudad?: string;
    idProvincia?: string;
    provincia?: string;
    idPais?: string;
    apartado?: string;
    telefono?: string;
}

export const clienteRegistradoVacio: ModeloClienteVentaRegistrado = {
    idCliente: "",
    idDireccion: "",
    nombre: "",
}

export const clienteRegistradoDesdeVenta = (venta?: VentaTpv): ModeloClienteVentaRegistrado => {

    return venta?.cliente?.id
        ? {
            idCliente: venta.cliente.id,
            idDireccion: venta.cliente.idDireccion ?? "",
            nombre: venta.cliente.nombre,
        }
        : clienteRegistradoVacio;
}

export const clienteNoRegistradoDesdeVenta = (venta?: VentaTpv): ModeloClienteVentaNoRegistrado => {

    return venta?.cliente && !venta.cliente.id
        ? {
            nombre: venta.cliente.nombre,
            idFiscal: venta.cliente.idFiscal,
            nombreVia: venta.cliente.direccion.nombre_via,
            codPostal: venta.cliente.direccion.cod_postal,
        }
        : clienteVentaNoRegistradoVacio;
}

export const clienteVentaNoRegistradoVacio: ModeloClienteVentaNoRegistrado = {
    nombre: "",
    idFiscal: "",
    nombreVia: "",
    tipoVia: "",
    numero: "",
    otros: "",
    codPostal: "",
    ciudad: "",
    idProvincia: "",
    provincia: "",
    idPais: "",
    apartado: "",
    telefono: "",
}

export const metaModeloClienteVentaRegistrado: MetaModelo<ModeloClienteVentaRegistrado> = {

    campos: {
        idCliente: { requerido: true },
        idDireccion: { requerido: true },
    }
};

export const metaModeloClienteVentaNoRegistrado: MetaModelo<ModeloClienteVentaNoRegistrado> = {

    campos: {
        nombre: { requerido: true },
        idFical: { requerido: true },
        nombreVia: { requerido: true },
    }
};