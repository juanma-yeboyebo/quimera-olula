import { Agenda } from "./agenda/vistas/Agenda.tsx";
import { Hoy } from "./hoy/vistas/Hoy.tsx";
import { TareasAtrasadas } from "./hoy/vistas/TareasAtrasadas.tsx";

export class RouterFactorySmartsalesSanhigia {
    static router = {
        "ss/hoy": Hoy,
        "ss/hoy/atrasadas": TareasAtrasadas,
        "ss/mi-agenda": Agenda,
    };
}
