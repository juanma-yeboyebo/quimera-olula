import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { anadirDeLista, anadirEnCarritoNuevo } from "../anadir.ts";
import { ResultadoAnadirLista } from "../diseño.ts";
import { limitarCantidadLinea } from "../dominio.ts";
import { getLineaListaRegalos, getListaRegalos } from "../infraestructura.ts";
import { ClaveFichaLinea, ContextoFichaLinea, EstadoFichaLinea } from "./diseño.ts";

type ProcesarFicha = ProcesarContexto<EstadoFichaLinea, ContextoFichaLinea>;

export const contextoFichaLineaInicial: ContextoFichaLinea = {
    estado: "CARGANDO",
    clave: null,
    nombreLista: "",
    ficha: null,
    cantidad: 1,
};

const estadoDe = (e: unknown): number | undefined => (e as { estado?: number })?.estado;

export const cargarFicha: ProcesarFicha = async (contexto, payload) => {
    const clave = (payload as ClaveFichaLinea | undefined) ?? contexto.clave;
    if (!clave) return { ...contextoFichaLineaInicial, estado: "NO_ENCONTRADA" };
    try {
        const [lista, ficha] = await Promise.all([
            getListaRegalos(clave.token),
            getLineaListaRegalos(clave.token, clave.idLinea),
        ]);
        return { ...contextoFichaLineaInicial, estado: "LISTO", clave, nombreLista: lista.nombre, ficha };
    } catch (e) {
        return {
            ...contextoFichaLineaInicial,
            estado: estadoDe(e) === 404 ? "NO_ENCONTRADA" : "ERROR",
            clave,
        };
    }
};

export const cambiarCantidad: ProcesarFicha = async (contexto, payload) => ({
    ...contexto,
    cantidad: contexto.ficha
        ? limitarCantidadLinea(Number(payload) || 1, contexto.ficha)
        : contexto.cantidad,
});

const estadoTrasAnadir = (resultado: ResultadoAnadirLista): EstadoFichaLinea =>
    resultado === "CARRITO_DE_OTRA_LISTA" ? "CARRITO_DE_OTRA_LISTA" : "LISTO";

const anadirCon =
    (accion: typeof anadirDeLista): ProcesarFicha =>
    async (contexto) => {
        const { ficha, clave } = contexto;
        if (!ficha || !clave) return { ...contexto, estado: "LISTO" };
        const resultado = await accion(clave.token, ficha.referencia, ficha.descripcion, contexto.cantidad);
        return { ...contexto, estado: estadoTrasAnadir(resultado) };
    };

export const anadirAlCarrito: ProcesarFicha = anadirCon(anadirDeLista);

export const empezarCarritoNuevo: ProcesarFicha = anadirCon(anadirEnCarritoNuevo);
