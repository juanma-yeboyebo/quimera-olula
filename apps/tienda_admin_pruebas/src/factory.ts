import { FactoryAuthOlula } from '#/auth/factory.ts';
import { FactoryTiendaAdmin } from '#/tienda_admin/factory.ts';
import { OlulaWordmark } from '@olula/componentes/tema/Olula.jsx';

class FactoryComponentesTiendaAdminPruebas {
    static cabecera_logo = () => OlulaWordmark({ color: '#ffffff', bowlColor: '#ffffff', className: 'logo-app', style: {} });
}

export class FactoryTiendaAdminPruebas {
    Auth = FactoryAuthOlula;
    Componentes = FactoryComponentesTiendaAdminPruebas;
    TiendaAdmin = FactoryTiendaAdmin;
}

export default FactoryTiendaAdminPruebas;
