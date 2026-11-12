import { FichaLineaListaRegalos } from "./web/ficha/FichaLineaListaRegalos.tsx";
import { ListaRegalosTienda } from "./web/lista/ListaRegalosTienda.tsx";

export class RouterFactoryTiendaListaRegalosWeb {
    static router = {
        "lista/:token": ListaRegalosTienda,
        "lista/:token/producto/:idlinea": FichaLineaListaRegalos,
    }
}
