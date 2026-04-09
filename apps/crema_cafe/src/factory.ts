import { FactoryTpvOlula } from '#/tpv/factory.ts';
import { FactoryVentasCremaCafe } from './contextos/ventas/factory.ts';

export class FactoryCremaCafe {
    Ventas = FactoryVentasCremaCafe;
    TPV = FactoryTpvOlula;
}

export default FactoryCremaCafe;
