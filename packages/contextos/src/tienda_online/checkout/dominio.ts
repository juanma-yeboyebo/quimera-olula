import { CarritoTienda, EstadoCarrito } from "../comun/diseño.ts";
import {
    DatosCheckout,
    DatosCheckoutApi,
    DireccionCheckout,
    DireccionCheckoutApi,
    ErroresCheckout,
    ResultadoPago,
} from "./diseño.ts";

const PAIS_POR_DEFECTO = "ES";

const direccionVacia = (): DireccionCheckout => ({
    nombreVia: "",
    tipoVia: null,
    numero: null,
    otros: null,
    codPostal: "",
    ciudad: "",
    provincia: null,
    paisId: PAIS_POR_DEFECTO,
    telefono: null,
});

const texto = (valor: unknown): string => (typeof valor === "string" ? valor : "");

const textoONulo = (valor: unknown): string | null => (typeof valor === "string" ? valor : null);

const direccionDesdeDatos = (valor: unknown): DireccionCheckout => {
    const d = (valor ?? {}) as Record<string, unknown>;
    return {
        nombreVia: texto(d.nombre_via),
        tipoVia: textoONulo(d.tipo_via),
        numero: textoONulo(d.numero),
        otros: textoONulo(d.otros),
        codPostal: texto(d.cod_postal),
        ciudad: texto(d.ciudad),
        provincia: textoONulo(d.provincia),
        paisId: texto(d.pais_id) || PAIS_POR_DEFECTO,
        telefono: textoONulo(d.telefono),
    };
};

export const datosCheckoutIniciales = (carrito: CarritoTienda | null): DatosCheckout => {
    const datos = carrito?.datosCheckout;
    if (!datos)
        return {
            email: "",
            nombre: "",
            idFiscal: null,
            telefono: null,
            direccionFacturacion: direccionVacia(),
            envioDistinto: false,
            direccionEnvio: direccionVacia(),
        };

    const envio = datos.direccion_envio;
    return {
        email: texto(datos.email),
        nombre: texto(datos.nombre),
        idFiscal: textoONulo(datos.id_fiscal),
        telefono: textoONulo(datos.telefono),
        direccionFacturacion: direccionDesdeDatos(datos.direccion_facturacion),
        envioDistinto: !!envio,
        direccionEnvio: envio ? direccionDesdeDatos(envio) : direccionVacia(),
    };
};

const vacio = (valor: string | null): boolean => !valor || valor.trim() === "";

const aNulo = (valor: string | null): string | null => (vacio(valor) ? null : valor);

const direccionAApi = (d: DireccionCheckout): DireccionCheckoutApi => ({
    nombre_via: d.nombreVia,
    tipo_via: aNulo(d.tipoVia),
    numero: aNulo(d.numero),
    otros: aNulo(d.otros),
    cod_postal: d.codPostal,
    ciudad: d.ciudad,
    provincia: aNulo(d.provincia),
    pais_id: d.paisId,
    telefono: aNulo(d.telefono),
});

export const datosCheckoutAApi = (d: DatosCheckout): DatosCheckoutApi => ({
    email: d.email,
    nombre: d.nombre,
    id_fiscal: aNulo(d.idFiscal),
    telefono: aNulo(d.telefono),
    direccion_facturacion: direccionAApi(d.direccionFacturacion),
    direccion_envio: d.envioDistinto ? direccionAApi(d.direccionEnvio) : null,
});

const emailValido = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const erroresDireccion = (prefijo: string, d: DireccionCheckout): ErroresCheckout => {
    const errores: ErroresCheckout = {};
    if (vacio(d.nombreVia)) errores[`${prefijo}.nombreVia`] = "La vía es obligatoria";
    if (vacio(d.codPostal)) errores[`${prefijo}.codPostal`] = "El código postal es obligatorio";
    if (vacio(d.ciudad)) errores[`${prefijo}.ciudad`] = "La ciudad es obligatoria";
    if (vacio(d.paisId)) errores[`${prefijo}.paisId`] = "El país es obligatorio";
    return errores;
};

export const erroresCheckout = (d: DatosCheckout): ErroresCheckout => ({
    ...(emailValido(d.email.trim()) ? {} : { email: "Introduce un email válido" }),
    ...(vacio(d.nombre) ? { nombre: "El nombre es obligatorio" } : {}),
    ...erroresDireccion("direccionFacturacion", d.direccionFacturacion),
    ...(d.envioDistinto ? erroresDireccion("direccionEnvio", d.direccionEnvio) : {}),
});

export const resultadoPago = (estado: EstadoCarrito): ResultadoPago => {
    if (estado === "PAGADO" || estado === "CONVERTIDO") return "CONFIRMADO";
    if (estado === "ERROR_CONVERSION") return "INCIDENCIA";
    return "PENDIENTE";
};

export const clavePagoEnCurso = (codigoStoreView: string): string =>
    `tienda_online.pago_en_curso.${codigoStoreView}`;
