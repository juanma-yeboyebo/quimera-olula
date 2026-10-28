import { Agenda } from "./agenda/vistas/Agenda.tsx";
import { Clientes } from "./clientes/vistas/Clientes.tsx";
import { FichaCliente } from "./clientes/vistas/FichaCliente.tsx";
import { Hoy } from "./hoy/vistas/Hoy.tsx";
import { TareasAtrasadas } from "./hoy/vistas/TareasAtrasadas.tsx";
import { NuevaTarea } from "./nueva_tarea/vistas/NuevaTarea.tsx";
import { DetalleTrato } from "./trato/vistas/DetalleTrato.tsx";
import { NuevoTrato } from "./tratos/vistas/NuevoTrato.tsx";
import { Tratos } from "./tratos/vistas/Tratos.tsx";
import { Visita } from "./visita/vistas/Visita.tsx";

export class RouterFactorySmartsalesSanhigia {
    static router = {
        "ss/hoy": Hoy,
        "ss/hoy/atrasadas": TareasAtrasadas,
        "ss/mi-agenda": Agenda,
        "ss/mi-tarea/nueva": NuevaTarea,
        "ss/mi-tarea/:id": Visita,
        "ss/mis-clientes": Clientes,
        "ss/mis-clientes/:codCliente": FichaCliente,
        "ss/mis-tratos": Tratos,
        "ss/mi-trato/nuevo": NuevoTrato,
        "ss/mi-trato/:id": DetalleTrato,
    };
}
