import { ClausulaFiltro, Criteria } from "@olula/lib/diseño.ts";
import {
    DatosCuenta,
    DatosRegistro,
    DireccionCuenta,
    DireccionRegistro,
    ErroresRegistro,
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

export const erroresDireccion = (d: DireccionRegistro): ErroresRegistro => {
    const errores: ErroresRegistro = {};
    if (vacio(d.nombreVia)) errores["direccion.nombreVia"] = "La vía es obligatoria";
    if (vacio(d.codPostal)) errores["direccion.codPostal"] = "El código postal es obligatorio";
    if (vacio(d.ciudad)) errores["direccion.ciudad"] = "La ciudad es obligatoria";
    if (vacio(d.paisId)) errores["direccion.paisId"] = "El país es obligatorio";
    return errores;
};

export const erroresDatosCuenta = (d: DatosCuenta): ErroresRegistro => {
    const errores: ErroresRegistro = {};
    if (vacio(d.nombre)) errores.nombre = "El nombre es obligatorio";
    if (vacio(d.idFiscal)) errores.idFiscal = "El NIF/CIF es obligatorio";
    return errores;
};

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
    if (vacio(d.idFiscal)) errores.idFiscal = "El NIF/CIF es obligatorio";
    Object.assign(errores, erroresDireccion(d.direccion));
    return errores;
};

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

export const textoDireccion = (d: DireccionCuenta): string =>
    [d.nombreVia, d.numero, d.codPostal, d.ciudad, d.provincia, d.paisId]
        .filter((parte) => parte && parte.trim() !== "")
        .join(", ");

export const etiquetasDireccion = (d: DireccionCuenta): string[] => [
    ...(d.facturacion ? ["Facturación"] : []),
    ...(d.envio ? ["Envío"] : []),
];
