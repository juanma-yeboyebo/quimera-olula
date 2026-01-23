import { MaestroAcciones } from "./accion/maestro/MaestroAcciones.tsx"
import { MaestroClientes } from "./cliente/maestro/MaestroClientes.tsx"
import { MaestroContactos } from "./contacto/maestro/MaestroContactos.tsx"
import { MaestroEstadosOportunidad } from "./estadoOportunidadVenta/maestro/MaestroEstadosOportunidad.tsx"
import { MaestroIncidencias } from "./incidencia/maestro/MaestroIncidencias.tsx"
import { MaestroLeads } from "./lead/maestro/MaestroLeads.tsx"
import { MaestroOportunidades } from "./oportunidadventa/maestro/MaestroOportunidadesVentas.tsx"

export class RouterFactoryCrmOlula {
    static router = {
        "crm/oportunidadventa": MaestroOportunidades,
        "crm/estadooportunidadventa": MaestroEstadosOportunidad,
        "crm/cliente": MaestroClientes,
        "crm/contacto": MaestroContactos,
        "crm/accion": MaestroAcciones,
        "crm/lead": MaestroLeads,
        "crm/incidencia": MaestroIncidencias,
    }
}
