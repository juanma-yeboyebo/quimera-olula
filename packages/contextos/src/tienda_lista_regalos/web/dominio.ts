import { limitarCantidad } from "#/tienda_online/comun/dominio.ts";
import { EstadoLineaLista, FichaLineaLista, LineaListaRegalos } from "./diseño.ts";

export const estaRegalada = (linea: LineaListaRegalos): boolean => linea.pendiente <= 0;

export const estadoLinea = (linea: LineaListaRegalos): EstadoLineaLista =>
    estaRegalada(linea) ? "REGALADA" : linea.disponible ? "DISPONIBLE" : "SIN_STOCK";

export const textoDistintivoLinea = (estado: EstadoLineaLista): string | null =>
    estado === "REGALADA" ? "Regalado" : estado === "SIN_STOCK" ? "Sin stock" : null;

export const textoPendiente = (linea: LineaListaRegalos): string =>
    `Quedan ${linea.pendiente} de ${linea.cantidad}`;

export const rutaLista = (token: string): string => `/lista/${token}`;

export const rutaLineaLista = (token: string, idLinea: number): string =>
    `/lista/${token}/producto/${idLinea}`;

export const limitarCantidadLinea = (cantidad: number, linea: LineaListaRegalos): number =>
    limitarCantidad(cantidad, 1, Math.max(1, linea.pendiente));

export const metadatosFichaLinea = (
    ficha: FichaLineaLista,
): { titulo: string; descripcion: string } => ({
    titulo: ficha.metaTitulo ?? ficha.descripcion,
    descripcion: ficha.metaDescripcion ?? ficha.descripcionCorta ?? "",
});
