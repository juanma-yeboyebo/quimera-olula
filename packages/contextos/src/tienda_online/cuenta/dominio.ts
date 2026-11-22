import { ClausulaFiltro, Criteria } from "@olula/lib/diseño.ts";
import {
    CambioPassword,
    DatosCuenta,
    DatosRegistro,
    DireccionCuenta,
    CuentaTienda,
    DireccionRegistro,
    ErroresRegistro,
    PaisTienda,
    PedidoResumen,
} from "./diseño.ts";

export const PEDIDOS_POR_PAGINA = 20;

const PAIS_POR_DEFECTO = "ES";
const LONGITUD_MINIMA_PASSWORD = 8;

export const datosRegistroIniciales = (): DatosRegistro => ({
    email: "",
    password: "",
    repetirPassword: "",
    nombre: "",
    idFiscal: "",
    telefono: null,
    direccion: {
        nombreVia: "",
        numero: null,
        codPostal: "",
        ciudad: "",
        provincia: null,
        paisId: PAIS_POR_DEFECTO,
    },
});

const vacio = (valor: string | null): boolean => !valor || valor.trim() === "";

export const aNulo = (valor: string | null): string | null => (vacio(valor) ? null : valor);

const emailValido = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const LETRAS_DNI = "TRWAGMYFPDXBNJZSQVHLCKE";
const PREFIJOS_NIE: Record<string, string> = { X: "0", Y: "1", Z: "2" };
const LETRAS_CONTROL_CIF = "JABCDEFGHI";
const MIN_CIFRAS_TELEFONO = 9;
const MAX_CIFRAS_TELEFONO = 15;

export const normalizarIdFiscal = (idFiscal: string): string => idFiscal.replace(/[\s-]/g, "").toUpperCase();

const dniValido = (numero: string, letra: string): boolean => LETRAS_DNI[Number(numero) % 23] === letra;

const cifValido = (valor: string): boolean => {
    const digitos = valor.slice(1, 8).split("").map(Number);
    const pares = digitos.filter((_, i) => i % 2 === 1).reduce((a, d) => a + d, 0);
    const impares = digitos
        .filter((_, i) => i % 2 === 0)
        .reduce((a, d) => a + Math.floor((d * 2) / 10) + ((d * 2) % 10), 0);
    const control = (10 - ((pares + impares) % 10)) % 10;
    return valor[8] === String(control) || valor[8] === LETRAS_CONTROL_CIF[control];
};

const idFiscalEspañolValido = (valor: string): boolean => {
    if (/^[0-9]{8}[A-Z]$/.test(valor)) return dniValido(valor.slice(0, 8), valor[8]);
    if (/^[XYZ][0-9]{7}[A-Z]$/.test(valor))
        return dniValido(PREFIJOS_NIE[valor[0]] + valor.slice(1, 8), valor[8]);
    if (/^[ABCDEFGHJNPQRSUVW][0-9]{7}[0-9A-J]$/.test(valor)) return cifValido(valor);
    return false;
};

export const idFiscalValido = (idFiscal: string, paisId: string | null): boolean => {
    const valor = normalizarIdFiscal(idFiscal);
    if (valor === "") return false;
    return paisId !== "ES" || idFiscalEspañolValido(valor);
};

export const telefonoValido = (telefono: string | null): boolean => {
    if (vacio(telefono)) return true;
    const valor = (telefono as string).trim();
    const cifras = valor.replace(/[^0-9]/g, "").length;
    return /^\+?[0-9 -]+$/.test(valor) && cifras >= MIN_CIFRAS_TELEFONO && cifras <= MAX_CIFRAS_TELEFONO;
};

const erroresIdFiscalYTelefono = (
    idFiscal: string,
    telefono: string | null,
    paisId: string | null,
): ErroresRegistro => {
    const errores: ErroresRegistro = {};
    if (vacio(idFiscal)) errores.idFiscal = "El NIF/CIF es obligatorio";
    else if (!idFiscalValido(idFiscal, paisId)) errores.idFiscal = "El NIF/CIF no es válido";
    if (!telefonoValido(telefono)) errores.telefono = "El teléfono no es válido";
    return errores;
};

export const erroresDireccion = (d: DireccionRegistro): ErroresRegistro => {
    const errores: ErroresRegistro = {};
    if (vacio(d.nombreVia)) errores["direccion.nombreVia"] = "La vía es obligatoria";
    if (vacio(d.codPostal)) errores["direccion.codPostal"] = "El código postal es obligatorio";
    if (vacio(d.ciudad)) errores["direccion.ciudad"] = "La ciudad es obligatoria";
    if (vacio(d.paisId)) errores["direccion.paisId"] = "El país es obligatorio";
    return errores;
};

export const erroresDatosCuenta = (d: DatosCuenta, paisId: string | null): ErroresRegistro => {
    const errores: ErroresRegistro = {};
    if (vacio(d.nombre)) errores.nombre = "El nombre es obligatorio";
    Object.assign(errores, erroresIdFiscalYTelefono(d.idFiscal, d.telefono, paisId));
    return errores;
};

export const erroresCambioPassword = (c: CambioPassword): ErroresRegistro => {
    const errores: ErroresRegistro = {};
    if (c.actual === "") errores.actual = "La contraseña actual es obligatoria";
    if (c.nueva.length < LONGITUD_MINIMA_PASSWORD)
        errores.nueva = `La contraseña debe tener al menos ${LONGITUD_MINIMA_PASSWORD} caracteres`;
    if (c.repetir !== c.nueva) errores.repetir = "Las contraseñas no coinciden";
    return errores;
};

export const passwordNuevoInicial = (): CambioPassword => ({ actual: "", nueva: "", repetir: "" });

export const direccionNuevaInicial = (): DireccionRegistro => ({
    nombreVia: "",
    numero: null,
    codPostal: "",
    ciudad: "",
    provincia: null,
    paisId: PAIS_POR_DEFECTO,
});

export const erroresRegistro = (d: DatosRegistro): ErroresRegistro => {
    const errores: ErroresRegistro = {};
    if (!emailValido(d.email.trim())) errores.email = "Introduce un email válido";
    if (d.password.length < LONGITUD_MINIMA_PASSWORD)
        errores.password = `La contraseña debe tener al menos ${LONGITUD_MINIMA_PASSWORD} caracteres`;
    if (d.repetirPassword !== d.password)
        errores.repetirPassword = "Las contraseñas no coinciden";
    if (vacio(d.nombre)) errores.nombre = "El nombre es obligatorio";
    Object.assign(errores, erroresIdFiscalYTelefono(d.idFiscal, d.telefono, d.direccion.paisId));
    Object.assign(errores, erroresDireccion(d.direccion));
    return errores;
};

export const CAMPOS_OBLIGATORIOS_REGISTRO = [
    "email",
    "password",
    "repetirPassword",
    "nombre",
    "idFiscal",
    "direccion.nombreVia",
    "direccion.codPostal",
    "direccion.ciudad",
    "direccion.paisId",
];

export const CAMPOS_VALIDADOS_REGISTRO = [...CAMPOS_OBLIGATORIOS_REGISTRO, "telefono"];

export const erroresVisiblesRegistro = (d: DatosRegistro, tocados: string[]): ErroresRegistro =>
    Object.fromEntries(Object.entries(erroresRegistro(d)).filter(([campo]) => tocados.includes(campo)));

export const campoRegistroValido = (campo: string, tocados: string[], errores: ErroresRegistro): boolean =>
    CAMPOS_OBLIGATORIOS_REGISTRO.includes(campo) && tocados.includes(campo) && !errores[campo];

export const criteriaPedidos = (pagina: number): Criteria => {
    const filtro: ClausulaFiltro[] = [];
    return {
        filtro,
        orden: ["fecha", "DESC"],
        paginacion: { limite: PEDIDOS_POR_PAGINA, pagina },
    };
};

export const añadirPedidos = (
    actuales: PedidoResumen[],
    nuevos: PedidoResumen[],
): PedidoResumen[] => {
    const vistos = new Set(actuales.map((p) => p.id));
    const añadidos = nuevos.filter((p) => {
        if (vistos.has(p.id)) return false;
        vistos.add(p.id);
        return true;
    });
    return [...actuales, ...añadidos];
};

export const paisFacturacion = (cuenta: CuentaTienda | null): string | null =>
    cuenta?.direcciones.find((d) => d.facturacion)?.paisId ?? null;

export const opcionesPais = (paises: PaisTienda[], actual: string | null): PaisTienda[] => {
    const lista = paises.length > 0 ? paises : [{ id: PAIS_POR_DEFECTO, nombre: PAIS_POR_DEFECTO }];
    if (!actual || lista.some((p) => p.id === actual)) return lista;
    return [...lista, { id: actual, nombre: actual }];
};

export const textoDireccion = (d: DireccionCuenta): string =>
    [d.nombreVia, d.numero, d.codPostal, d.ciudad, d.provincia, d.paisId]
        .filter((parte) => parte && parte.trim() !== "")
        .join(", ");

export const etiquetasDireccion = (d: DireccionCuenta): string[] => [
    ...(d.facturacion ? ["Facturación"] : []),
    ...(d.envio ? ["Envío"] : []),
];
