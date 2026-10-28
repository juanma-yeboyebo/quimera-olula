import { LegacyAPI, legacyUrl } from "@olula/lib/api/legacy_api.ts";
import { Agente, AgenteAPI, UsuarioSmartsales, UsuarioSmartsalesAPI } from "./diseño.ts";

const agenteDesdeAPI = (agente: AgenteAPI): Agente => ({
    codigo: agente.codagente,
    nombre: agente.nombreap,
});

export const getUsuarioSmartsales = async (): Promise<UsuarioSmartsales> => {
    const usuario = await LegacyAPI.get<UsuarioSmartsalesAPI>(
        legacyUrl("user", { action: "whoami", staticAction: true })
    );

    return {
        agente: usuario.agente ?? "",
        superusuario: !!usuario.superuser,
    };
};

export const getAgentesPermitidos = async (): Promise<Agente[]> => {
    const respuesta = await LegacyAPI.get<{ data: AgenteAPI[] }>(
        legacyUrl("agentes", {
            params: {
                fields: ["codagente", "nombreap"],
                order: { field: "nombreap", direction: "ASC" },
                page: { limit: 10000 },
            },
        })
    );

    return respuesta.data.map(agenteDesdeAPI);
};
