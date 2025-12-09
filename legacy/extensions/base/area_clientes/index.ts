import core from '@quimera-extension/core'
// import login from '@quimera-extension/login'

// import * as VentasHomeAreaClientes from './views/VentasHomeAreaClientes'
import * as HomeAreaClientes from './views/HomeAreaClientes'
import * as MisPedidos from './views/MisPedidos'
import * as MisAlbaranes from './views/MisAlbaranes'
import * as MisFacturas from './views/MisFacturas'
// import * as Facturas from './views/Facturas'
import * as MiPedido from './views/MiPedido'
import * as MiAlbaran from './views/MiAlbaran'
import * as MiFactura from './views/MiFactura'


import * as PedidosMaster from './views/MisPedidos/MisPedidosMaster'
import * as AlbaranesMaster from './views/MisAlbaranes/MisAlbaranesMaster'
import * as FacturasMaster from './views/MisFacturas/MisFacturasMaster'
// import * as FacturasMaster from './views/Facturas/FacturasMaster'

import AppMenu from './static/appmenu'
import { translations } from './static/translations'

export * from './comps'
import schemas from './static/schemas'

export default {
  path: 'extensions/base/area_clientes',
  views: {
    HomeAreaClientes,
    MiPedido,
    MisPedidos,
    MiAlbaran,
    MisAlbaranes,
    MiFactura,
    MisFacturas,
  },
  subviews: {
    PedidosMaster,
    FacturasMaster,
    AlbaranesMaster,
  },
  routes: {
    '/areaclientes': { type: 'view', view: 'HomeAreaClientes' },
    '/areaclientes/': { type: 'view', view: 'HomeAreaClientes' },
    '/areaclientes/pedidos': { type: 'view', view: 'MisPedidos' },
    '/areaclientes/pedidos/:idPedido': { type: 'view', view: 'MisPedidos' },
    '/areaclientes/facturas': { type: 'view', view: 'MisFacturas' },
    '/areaclientes/facturas/:idFactura': { type: 'view', view: 'MisFacturas' },
    '/areaclientes/albaranes': { type: 'view', view: 'MisAlbaranes' },
    '/areaclientes/albaranes/:idAlbaran': { type: 'view', view: 'MisAlbaranes' }
  },
  dependencies: [
    core
  ],
  menus: {
    app: AppMenu
  },
  rules: {
    'AreaClientes:visit': (check: Function) => check("area_clientes.acceso"),
  },
  schemas,
  translations
}



