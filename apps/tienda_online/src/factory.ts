import { FactoryTiendaOnline } from '#/tienda_online/factory.ts';

export class FactoryAuthTienda {
    static formato_login = "email";
    static rutas_publicas = ["/", "/catalogo", "/categoria", "/producto", "/carrito", "/checkout", "/registro"];
}

export class FactoryTienda {
    Auth = FactoryAuthTienda;
    TiendaOnline = FactoryTiendaOnline;
}

export default FactoryTienda;
