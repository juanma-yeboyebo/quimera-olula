import { Agenda } from "./agenda/vistas/Agenda.tsx";
import { Campanias } from "./campanias/vistas/Campanias.tsx";
import { DetalleCampania } from "./campanias/vistas/DetalleCampania.tsx";
import { NuevaCampania } from "./campanias/vistas/NuevaCampania.tsx";
import { Clientes } from "./clientes/vistas/Clientes.tsx";
import { FichaCliente } from "./clientes/vistas/FichaCliente.tsx";
import { FichaContacto } from "./contacto/vistas/FichaContacto.tsx";
import { NuevoContacto } from "./contacto/vistas/NuevoContacto.tsx";
import { Hoy } from "./hoy/vistas/Hoy.tsx";
import { TareasAtrasadas } from "./hoy/vistas/TareasAtrasadas.tsx";
import { NuevaTarea } from "./nueva_tarea/vistas/NuevaTarea.tsx";
import { Objetivos } from "./objetivos/vistas/Objetivos.tsx";
import { FiltrosProspeccion } from "./prospeccion/vistas/FiltrosProspeccion.tsx";
import { MapaClientes } from "./prospeccion/vistas/MapaClientes.tsx";
import { Rendimiento } from "./rendimiento/vistas/Rendimiento.tsx";
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
        "ss/mi-contacto/nuevo": NuevoContacto,
        "ss/mi-contacto/:codContacto": FichaContacto,
        "ss/mis-tratos": Tratos,
        "ss/mi-trato/nuevo": NuevoTrato,
        "ss/mi-trato/:id": DetalleTrato,
        "ss/mi-rendimiento": Rendimiento,
        "ss/mi-objetivo": Objetivos,
        "ss/mis-campanias": Campanias,
        "ss/mis-campanias/nueva": NuevaCampania,
        "ss/mis-campanias/:id": DetalleCampania,
        "ss/mapa": MapaClientes,
        "ss/prospeccion": FiltrosProspeccion,
    };
}
