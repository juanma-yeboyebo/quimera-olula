import { Presupuesto } from "#/ventas/presupuesto/diseño.ts";
import { MetaModelo } from "@olula/lib/dominio.js";
import { CambioCliente } from "./diseño.ts";

export const cambioClienteVacio: CambioCliente = {
    cliente_id: "",
    nombre_cliente: "",
    direccion_id: "",
};

export const cambioCliente = (presupuesto: Presupuesto): CambioCliente => ({
    cliente_id: presupuesto.cliente.cliente_id ?? "",
    nombre_cliente: presupuesto.cliente.nombre_cliente,
    direccion_id: presupuesto.cliente.direccion_id ?? "",
});

export const metaCambioCliente: MetaModelo<CambioCliente> = {
    // validador: makeValidador({}),
    campos: {
        cliente_id: { requerido: true },
        direccion_id: { requerido: true },
    }
};