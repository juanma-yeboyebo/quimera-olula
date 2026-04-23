import { MetaModelo } from "@olula/lib/dominio.js";
import { NuevoLead } from "./diseño.ts";

export const nuevoLeadVacio: NuevoLead = {
    cliente_id: "",
    nombre: "",
    tipo: "Cliente",
};

export const metaNuevoLead: MetaModelo<NuevoLead> = {
    campos: {
        cliente_id: { requerido: false, tipo: "autocompletar" },
        nombre: { requerido: true },
        tipo: { requerido: true, bloqueado: true },
        responsable_id: { requerido: true, tipo: "autocompletar" },
    },
};