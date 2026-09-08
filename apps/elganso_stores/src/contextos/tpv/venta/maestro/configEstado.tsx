import { QIcono } from "@olula/componentes/index.js";
import { ReactElement } from "react";

// Estado real de una venta TPV de El Ganso (Abierta/Cerrada/Anulada, igual
// que en Eneboo) — no se traduce al vocabulario genérico
// Pendiente/Parcial/Servido de otras apps.

export const ESTADO_ABIERTA = "Abierta";
export const ESTADO_CERRADA = "Cerrada";
export const ESTADO_ANULADA = "Anulada";

export const etiquetaEstado = "Estado";

export const opcionesEstado = [
  { valor: ESTADO_ABIERTA, descripcion: "Abierta" },
  { valor: ESTADO_CERRADA, descripcion: "Cerrada" },
  { valor: ESTADO_ANULADA, descripcion: "Anulada" },
];

export const colorDeEstado = (estado: string): string => {
  if (estado === ESTADO_CERRADA) return "cerrado";
  if (estado === ESTADO_ANULADA) return "anulado";
  return "pendiente";
};

export const iconosEstado: Record<string, ReactElement> = {
  cerrado: (
    <QIcono
      nombre={"circulo_relleno"}
      tamaño="sm"
      color="var(--color-deshabilitado-oscuro)"
    />
  ),
  pendiente: (
    <QIcono
      nombre={"circulo_relleno"}
      tamaño="sm"
      color="var(--color-exito-oscuro)"
    />
  ),
  anulado: (
    <QIcono
      nombre={"circulo_relleno"}
      tamaño="sm"
      color="var(--color-error-oscuro)"
    />
  ),
};
