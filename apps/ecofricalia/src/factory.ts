import { FactoryAuthOlula } from '#/auth/factory.ts';
import { FactoryCrmOlula } from '#/crm/factory.ts';


export class FactoryEcofricalia {
    Inicio = { menu: { "Inicio": { url: "/", icono: "inicio" } } };
    Crm = FactoryCrmOlula;
    Auth = FactoryAuthOlula;
}

export default FactoryEcofricalia;