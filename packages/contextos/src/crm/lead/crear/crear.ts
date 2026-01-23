import { MetaModelo } from "@olula/lib/dominio.js";
import { NuevoLead } from "./diseño.ts";

export const nuevoLeadVacio: NuevoLead = {
    cliente_id: "",
    nombre: "",
    tipo: "Cliente",
    fuente_id: "",
    estado_id: "",
};

export const metaNuevoLead: MetaModelo<NuevoLead> = {
    campos: {
        cliente_id: { requerido: false, tipo: "autocompletar" },
        nombre: { requerido: true },
        tipo: { requerido: true, bloqueado: true },
        fuente_id: { requerido: true, tipo: "selector" },
        estado_id: { requerido: true, tipo: "selector" },
        responsable_id: { requerido: true, tipo: "autocompletar" },
    },
};