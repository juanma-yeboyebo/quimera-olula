import { MetaModelo, stringNoVacio } from "@olula/lib/dominio.ts";
import { CredencialExterna } from "#/comun/credencial_externa/diseño.ts";
import {
    CambiosFormaPagoTienda,
    ConexionFormaPago,
    CuentaStripe,
    DestinoFormaPagoTienda,
    EdicionFormaPagoTienda,
    FormaPagoTienda,
    FormaPagoTiendaDetalle,
    NuevaFormaPagoTienda,
    TipoFormaPagoTienda,
} from "./diseño.ts";

export const PROVEEDOR_STRIPE = "Stripe";
export const REGLA_CREDENCIALES = "comun.credencial_externa";
export const URL_CREDENCIALES = "/comun/credencial-externa";
export const AVISO_SIN_CUENTAS = "No hay ninguna cuenta de Stripe. Créala en Administración › Credenciales";
export const TEXTO_SIN_CUENTA = "Sin cuenta de Stripe";
export const AVISO_SIN_CONECTAR =
    "Stripe todavía no avisa a la tienda de los pagos. Pulsa «Comprobar conexión» para darlo de alta.";

export const opcionesTipo: { valor: TipoFormaPagoTienda; descripcion: string }[] = [
    { valor: "PASARELA", descripcion: "Tarjeta" },
    { valor: "SIN_PASARELA", descripcion: "Sin pago online" },
];

export const opcionesDestino: { valor: DestinoFormaPagoTienda; descripcion: string }[] = [
    { valor: "PEDIDO", descripcion: "Pedido" },
    { valor: "VENTA_TPV", descripcion: "Venta en TPV" },
];

export const textoTipo = (tipo: TipoFormaPagoTienda): string =>
    opcionesTipo.find((o) => o.valor === tipo)?.descripcion ?? tipo;

export const esTarjeta = (forma: { tipo: TipoFormaPagoTienda }): boolean => forma.tipo === "PASARELA";

export const textoCuenta = (forma: FormaPagoTienda): string | null =>
    esTarjeta(forma) ? (forma.credencial?.nombre ?? TEXTO_SIN_CUENTA) : null;

export const cuentasStripe = (credenciales: CredencialExterna[]): CuentaStripe[] =>
    credenciales
        .filter((c) => c.proveedor === PROVEEDOR_STRIPE && c.activo && c.propietarioId === null && c.categoria === "conector")
        .map((c) => ({ id: c.id, nombre: c.nombre }));

export const opcionesCuentas = (cuentas: CuentaStripe[]) =>
    cuentas.map((c) => ({ valor: c.id, descripcion: c.nombre }));

export const estaConectada = (conexion: ConexionFormaPago | null): boolean =>
    conexion !== null && (conexion.modo === "live" ? conexion.live : conexion.test);

export const formaPagoVacia = (): FormaPagoTiendaDetalle => ({
    id: "",
    websiteId: 0,
    codigo: "",
    nombre: "",
    descripcion: "",
    tipo: "PASARELA",
    codpago: "",
    orden: 0,
    activo: true,
    credencial: null,
    destino: "PEDIDO",
    recibosPagados: true,
    conexion: null,
});

export const nuevaFormaPagoVacia = (): NuevaFormaPagoTienda => ({
    tipo: "PASARELA",
    codigo: "",
    nombre: "",
    descripcion: "",
    codpago: "",
    credencialId: "",
    destino: "PEDIDO",
    recibosPagados: true,
});

export const metaNuevaFormaPago: MetaModelo<NuevaFormaPagoTienda> = {
    campos: {
        tipo: { tipo: "selector", requerido: true },
        codigo: { requerido: true, validacion: (m) => stringNoVacio(m.codigo) },
        nombre: { requerido: true, validacion: (m) => stringNoVacio(m.nombre) },
        descripcion: {},
        codpago: { tipo: "selector", requerido: true },
        credencialId: { tipo: "selector" },
        destino: { tipo: "selector", requerido: true },
        recibosPagados: { tipo: "checkbox" },
    },
    editable: (m, campo) => (campo !== "credencialId" && campo !== "recibosPagados") || esTarjeta(m),
    onChange: (m, campo) => (campo === "tipo" && !esTarjeta(m) ? { ...m, credencialId: "" } : m),
};

export const edicionDeForma = (forma: FormaPagoTienda): EdicionFormaPagoTienda => ({
    nombre: forma.nombre,
    descripcion: forma.descripcion,
    codpago: forma.codpago,
    credencialId: forma.credencial?.id ?? "",
    orden: forma.orden,
    activo: forma.activo,
    destino: forma.destino,
    recibosPagados: forma.recibosPagados,
});

export const metaEdicionFormaPago: MetaModelo<EdicionFormaPagoTienda> = {
    campos: {
        nombre: { requerido: true, validacion: (m) => stringNoVacio(m.nombre) },
        descripcion: {},
        codpago: { tipo: "selector", requerido: true },
        credencialId: { tipo: "selector" },
        orden: { tipo: "entero" },
        activo: { tipo: "checkbox" },
        destino: { tipo: "selector", requerido: true },
        recibosPagados: { tipo: "checkbox" },
    },
};

export const cambiosDeEdicion = (forma: FormaPagoTienda, e: EdicionFormaPagoTienda): CambiosFormaPagoTienda => {
    const original = edicionDeForma(forma);
    const cambios: CambiosFormaPagoTienda = {};
    if (e.nombre.trim() !== original.nombre) cambios.nombre = e.nombre.trim();
    if (e.descripcion !== original.descripcion) cambios.descripcion = e.descripcion.trim() || null;
    if (e.codpago !== original.codpago) cambios.codpago = e.codpago;
    if (esTarjeta(forma) && e.credencialId !== original.credencialId) cambios.credencialId = e.credencialId || null;
    if (Number(e.orden) !== original.orden) cambios.orden = Number(e.orden);
    if (e.activo !== original.activo) cambios.activo = e.activo;
    if (e.destino !== original.destino) cambios.destino = e.destino;
    if (esTarjeta(forma) && e.recibosPagados !== original.recibosPagados) cambios.recibosPagados = e.recibosPagados;
    return cambios;
};

export const hayCambios = (cambios: CambiosFormaPagoTienda): boolean => Object.keys(cambios).length > 0;
