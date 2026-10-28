import { Agenda } from "./agenda/vistas/Agenda.tsx";
import { Hoy } from "./hoy/vistas/Hoy.tsx";
import { TareasAtrasadas } from "./hoy/vistas/TareasAtrasadas.tsx";
import { NuevaTarea } from "./nueva_tarea/vistas/NuevaTarea.tsx";
import { Visita } from "./visita/vistas/Visita.tsx";

export class RouterFactorySmartsalesSanhigia {
    static router = {
        "ss/hoy": Hoy,
        "ss/hoy/atrasadas": TareasAtrasadas,
        "ss/mi-agenda": Agenda,
        "ss/mi-tarea/nueva": NuevaTarea,
        "ss/mi-tarea/:id": Visita,
    };
}
