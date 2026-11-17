import { FactoryTiendaOnline } from '#/tienda_online/factory.ts';
import { PieDulceBebe } from './componentes/pie_dulce_bebe.tsx';

export class FactoryAuthTienda {
    static formato_login = "email";
    static rutas_publicas = ["/", "/lista", "/carrito", "/checkout", "/registro"];
}

class FactoryTiendaOnlineDulceBebe extends FactoryTiendaOnline {
    static ruta_seguir_comprando = "/";
    static texto_seguir_comprando = "Volver al inicio";
    static cabecera_buscador = false as const;
    static menu_categorias = false as const;
    static layout_pie = PieDulceBebe;
}

export class FactoryTienda {
    Auth = FactoryAuthTienda;
    TiendaOnline = FactoryTiendaOnlineDulceBebe;
}

export default FactoryTienda;
