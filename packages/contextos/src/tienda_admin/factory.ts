import { menuTiendaAdmin } from "./menu.ts";

export class FactoryTiendaAdmin {
    static menu: Record<string, { icono?: string; url?: string; regla?: string }> = menuTiendaAdmin
}
