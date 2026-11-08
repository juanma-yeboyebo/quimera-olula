# Administración de la tienda — común

Contexto `tienda_admin`: administración de la tienda online para el personal de la empresa. No forma parte de `RouterFactoryOlula`: lo añade la app ERP de cada cliente con tienda (`TiendaAdmin = RouterFactoryTiendaAdmin` en su router y su menú en la factory). Sigue la plantilla `_plantilla/modulo` (maestro/detalle/crear) y los componentes Q del ERP; no usa los estilos de la tienda.

Backend: rutas `/tienda_admin/*` de la app `tienda_online` de `olula_servidor`.

| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/tienda_admin/website` | `{datos: [{id, codigo, nombre, activo}]}` |

## Menú y rutas

<!-- [tienda_admin-menu-01] [nueva] -->
`tienda_admin/menu.ts` define el área «Tienda online» con: «Artículos web» (`/tienda_admin/articulo`, regla `tienda_admin.articulo`), «Categorías» (`/tienda_admin/categoria`, regla `tienda_admin.categoria`), «Pedidos» (`/tienda_admin/pedido`) y «Configuración» (`/tienda_admin/configuracion`).

<!-- [tienda_admin-menu-02] [nueva] -->
`tienda_admin/router_factory.ts` exporta `RouterFactoryTiendaAdmin` con las cuatro rutas. Ninguna app lo incluye por defecto.

## Website activo

<!-- [tienda_admin-website-01] [nueva] -->
Las pantallas de artículos y categorías tienen arriba un selector de website (`GET /tienda_admin/website`). Al cargar se elige el primero activo; el elegido se recuerda entre pantallas mientras dure la sesión. Si solo hay uno, se muestra su nombre sin selector.
