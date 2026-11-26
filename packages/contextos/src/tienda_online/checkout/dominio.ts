import {
    CarritoTienda,
    EstadoCarrito,
    FormaEnvioTienda,
    FormaPagoTienda,
} from "../comun/diseño.ts";
import { CuentaTienda, DireccionCuenta, PaisTienda } from "../cuenta/diseño.ts";
import {
    DatosCheckout,
    DireccionCheckout,
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

const formaInicial = (idCarrito: number | undefined, formas: { id: number }[]): number | null =>
    (formas.find((f) => f.id === idCarrito) ?? formas[0])?.id ?? null;

export const esRecogida = (idFormaEnvio: number | null, formas: FormaEnvioTienda[]): boolean =>
    formas.find((f) => f.id === idFormaEnvio)?.tipo === "RECOGIDA";

export const elegirFormaEnvio = (
    datos: DatosCheckout,
    forma: FormaEnvioTienda,
): DatosCheckout => ({
    ...datos,
    idFormaEnvio: forma.id,
    envioDistinto: forma.tipo === "RECOGIDA" ? false : datos.envioDistinto,
});

export const ajustarFormas = (
    datos: DatosCheckout,
    formasEnvio: FormaEnvioTienda[],
    formasPago: FormaPagoTienda[],
): DatosCheckout => {
    const envioValido = formasEnvio.some((f) => f.id === datos.idFormaEnvio);
    const pagoValido = formasPago.some((f) => f.id === datos.idFormaPago);
    if (envioValido && pagoValido) return datos;
    const conEnvio = envioValido
        ? datos
        : formasEnvio[0]
          ? elegirFormaEnvio(datos, formasEnvio[0])
          : { ...datos, idFormaEnvio: null };
    return pagoValido ? conEnvio : { ...conEnvio, idFormaPago: formasPago[0]?.id ?? null };
};

export const datosCheckoutIniciales = (
    carrito: CarritoTienda | null,
    formasEnvio: FormaEnvioTienda[] = [],
    formasPago: FormaPagoTienda[] = [],
    conDedicatoria = false,
): DatosCheckout => {
    const dedicatoria = conDedicatoria ? { dedicatoria: carrito?.dedicatoria ?? "" } : {};
    const datos = carrito?.datosCheckout;
    const idFormaEnvio = formaInicial(carrito?.formaEnvio?.id, formasEnvio);
    const idFormaPago = formaInicial(carrito?.formaPago?.id, formasPago);
    if (!datos)
        return {
            email: "",
            nombre: "",
            idFiscal: null,
            telefono: null,
            direccionFacturacion: direccionVacia(),
            envioDistinto: false,
            direccionEnvio: direccionVacia(),
            idFormaEnvio,
            idFormaPago,
            ...dedicatoria,
        };

    const envio = datos.direccion_envio;
    return {
        email: texto(datos.email),
        nombre: texto(datos.nombre),
        idFiscal: textoONulo(datos.id_fiscal),
        telefono: textoONulo(datos.telefono),
        direccionFacturacion: direccionDesdeDatos(datos.direccion_facturacion),
        envioDistinto: !!envio && !esRecogida(idFormaEnvio, formasEnvio),
        direccionEnvio: envio ? direccionDesdeDatos(envio) : direccionVacia(),
        idFormaEnvio,
        idFormaPago,
        ...dedicatoria,
    };
};

export type TipoDireccionCheckout = "facturacion" | "envio";

export const direccionDesdeCuenta = (d: DireccionCuenta): DireccionCheckout => ({
    nombreVia: d.nombreVia,
    tipoVia: null,
    numero: d.numero,
    otros: null,
    codPostal: d.codPostal,
    ciudad: d.ciudad,
    provincia: d.provincia,
    paisId: d.paisId || PAIS_POR_DEFECTO,
    telefono: null,
});

export const direccionInicialCuenta = (
    cuenta: CuentaTienda,
    tipo: TipoDireccionCheckout,
): DireccionCuenta | null =>
    cuenta.direcciones.find((d) => (tipo === "envio" ? d.envio : d.facturacion)) ??
    cuenta.direcciones[0] ??
    null;

export const lineasDireccionCuenta = (d: DireccionCuenta, paises: PaisTienda[]): string[] => {
    const unir = (partes: (string | null)[], separador: string) =>
        partes.filter((p) => p && p.trim() !== "").join(separador);
    const pais = paises.find((p) => p.id === d.paisId)?.nombre ?? d.paisId;
    return [
        unir([d.nombreVia, d.numero], ", "),
        unir([d.codPostal, d.ciudad], " "),
        unir([d.provincia, pais], ", "),
    ].filter((l) => l !== "");
};

export const aplicarDireccionCuenta = (
    datos: DatosCheckout,
    cuenta: CuentaTienda,
    tipo: TipoDireccionCheckout,
    id: string | null,
): DatosCheckout => {
    const elegida = cuenta.direcciones.find((d) => d.id === id);
    const direccion = elegida ? direccionDesdeCuenta(elegida) : direccionVacia();
    return tipo === "envio" ? { ...datos, direccionEnvio: direccion } : { ...datos, direccionFacturacion: direccion };
};

export const idDireccionCuentaDe = (cuenta: CuentaTienda, direccion: DireccionCheckout): string | null =>
    cuenta.direcciones.find(
        (d) =>
            d.nombreVia === direccion.nombreVia &&
            (d.numero ?? "") === (direccion.numero ?? "") &&
            d.codPostal === direccion.codPostal &&
            d.ciudad === direccion.ciudad &&
            d.paisId === direccion.paisId,
    )?.id ?? null;

export const datosConCuenta = (
    datos: DatosCheckout,
    cuenta: CuentaTienda,
): DatosCheckout => {
    const carritoConDatos = !vacio(datos.nombre) || !vacio(datos.direccionFacturacion.nombreVia);
    const facturacion = direccionInicialCuenta(cuenta, "facturacion");
    const envio = direccionInicialCuenta(cuenta, "envio");
    const base = carritoConDatos
        ? datos
        : {
              ...datos,
              email: cuenta.email,
              nombre: cuenta.nombre,
              idFiscal: cuenta.idFiscal,
              telefono: cuenta.telefono,
              direccionFacturacion: facturacion ? direccionDesdeCuenta(facturacion) : datos.direccionFacturacion,
          };
    return {
        ...base,
        email: cuenta.email,
        direccionEnvio: envio && !base.envioDistinto ? direccionDesdeCuenta(envio) : base.direccionEnvio,
    };
};

const vacio = (valor: string | null): boolean => !valor || valor.trim() === "";

export const aNulo = (valor: string | null): string | null => (vacio(valor) ? null : valor);

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
    if (estado === "PAGADO" || estado === "CONFIRMADO" || estado === "CONVERTIDO")
        return "CONFIRMADO";
    if (estado === "ERROR_CONVERSION") return "INCIDENCIA";
    return "PENDIENTE";
};

export const clavePagoEnCurso = (codigoStoreView: string): string =>
    `tienda_online.pago_en_curso.${codigoStoreView}`;
