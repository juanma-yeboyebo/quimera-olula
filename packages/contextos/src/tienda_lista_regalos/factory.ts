import { menuTiendaListaRegalos } from "./menu.ts";

export class FactoryTiendaListaRegalos {
    static menu: Record<string, { icono?: string; url?: string; regla?: string }> = menuTiendaListaRegalos
}
