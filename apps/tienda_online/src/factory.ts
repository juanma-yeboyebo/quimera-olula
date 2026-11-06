import { AccionesCabeceraTienda } from '#/tienda_online/comun/componentes/acciones_cabecera_tienda.tsx';
import { FactoryTiendaOnline } from '#/tienda_online/factory.ts';
import { OlulaWordmark } from '@olula/componentes/tema/Olula.jsx';

class FactoryComponentesTienda {
    static cabecera_logo = () => OlulaWordmark({ color: '#ffffff', bowlColor: '#ffffff', className: 'logo-app', style: {} });
    static cabecera_acciones = AccionesCabeceraTienda;
}

export class FactoryAuthTienda {
    static formato_login = "email";
    static rutas_publicas = ["/", "/catalogo", "/categoria", "/producto", "/carrito", "/checkout", "/registro"];
}

export class FactoryTienda {
    Componentes = FactoryComponentesTienda;
    Auth = FactoryAuthTienda;
    TiendaOnline = FactoryTiendaOnline;
}

export default FactoryTienda;
