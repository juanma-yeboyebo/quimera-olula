import { ClausulaFiltro, Criteria } from "@olula/lib/diseño.ts";
import {
    DatosRegistro,
    DireccionCuenta,
    ErroresRegistro,
    PedidoResumen,
    RegistroApi,
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

const aNulo = (valor: string | null): string | null => (vacio(valor) ? null : valor);

const emailValido = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const erroresRegistro = (d: DatosRegistro): ErroresRegistro => {
    const errores: ErroresRegistro = {};
    if (!emailValido(d.email.trim())) errores.email = "Introduce un email válido";
    if (d.password.length < LONGITUD_MINIMA_PASSWORD)
        errores.password = `La contraseña debe tener al menos ${LONGITUD_MINIMA_PASSWORD} caracteres`;
    if (d.repetirPassword !== d.password)
        errores.repetirPassword = "Las contraseñas no coinciden";
    if (vacio(d.nombre)) errores.nombre = "El nombre es obligatorio";
    if (vacio(d.idFiscal)) errores.idFiscal = "El NIF/CIF es obligatorio";
    if (vacio(d.direccion.nombreVia)) errores["direccion.nombreVia"] = "La vía es obligatoria";
    if (vacio(d.direccion.codPostal))
        errores["direccion.codPostal"] = "El código postal es obligatorio";
    if (vacio(d.direccion.ciudad)) errores["direccion.ciudad"] = "La ciudad es obligatoria";
    if (vacio(d.direccion.paisId)) errores["direccion.paisId"] = "El país es obligatorio";
    return errores;
};

export const registroAApi = (d: DatosRegistro): RegistroApi => ({
    email: d.email,
    password: d.password,
    nombre: d.nombre,
    id_fiscal: d.idFiscal,
    telefono: aNulo(d.telefono),
    direccion: {
        nombre_via: d.direccion.nombreVia,
        numero: aNulo(d.direccion.numero),
        cod_postal: d.direccion.codPostal,
        ciudad: d.direccion.ciudad,
        provincia: aNulo(d.direccion.provincia),
        pais_id: d.direccion.paisId,
    },
});

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
