# Tienda Dulce Bebé y admin de listas en el ERP

Montaje de la extensión de listas de regalo en las apps de Dulce Bebé:
- `apps/tienda_dulce_bebe` (paquete `@olula/tienda_dulce_bebe`), app nueva: la web de compra de las listas, sin portada ni catálogo. Se entra por el enlace de una lista.
- `apps/dulce_bebe`, el ERP que ya existe, gana el admin de listas.

Backend: app `dulce_bebe` de `olula_servidor`, con las capas de la tienda y de la extensión.

## Specs

### App `tienda_dulce_bebe`

<!-- [dulce_bebe-tienda-app-01] [x] -->
Existe la app `apps/tienda_dulce_bebe`, copia de `apps/tienda_online` (vite, tsconfig, eslint, `index.html`, `index.css`, `main.tsx` con `LayoutTienda`, `.env.example` con `VITE_API_URL` y `VITE_STORE_VIEW=dulce_bebe`). El título de la página es «Dulce Bebé».

<!-- [dulce_bebe-tienda-app-02] [x] -->
Sus rutas son:
- `/`: portada propia (`dulce_bebe-tienda-portada-01`);
- `lista/:token` y `lista/:token/producto/:idlinea`, de `RouterFactoryTiendaListaRegalosWeb`;
- `carrito`, `checkout`, `checkout/ok` y `checkout/cancelado`, de `tienda_online`;
- `login`, `logout`, `registro`, `mi-cuenta` y `mi-cuenta/pedido/:id`, como en `apps/tienda_online`.

No monta la portada de la tienda, `catalogo`, `categoria/:slug` ni `producto/:slug`.

<!-- [dulce_bebe-tienda-app-03] [x] -->
Las rutas públicas son `/`, `/lista`, `/carrito`, `/checkout` y `/registro`. `/mi-cuenta` exige login.

<!-- [dulce_bebe-tienda-app-04] [x] -->
Su `FactoryTiendaOnline` (una subclase en la app) cambia:
- `ruta_seguir_comprando` a `/` y `texto_seguir_comprando` a «Volver al inicio»;
- `cabecera_buscador` y `menu_categorias` a `false` (`tienda-cabecera-08`);
- `layout_pie` a un pie propio con «Mi cuenta» y «Carrito», sin categorías.

### Portada

<!-- [dulce_bebe-tienda-portada-01] [x] -->
La ruta `/` muestra el nombre del website como título y el texto «Para ver una lista de regalo, abre el enlace que te han compartido». No llama al servidor más que para el storeview. Si el storeview no está configurado o no existe, muestra el mismo error que el resto de páginas (`ConStoreView`).

### ERP `dulce_bebe`

<!-- [dulce_bebe-erp-01] [x] -->
La factory de `apps/dulce_bebe` añade `TiendaListaRegalos = FactoryTiendaListaRegalos`, así que el menú gana «Tienda online › Listas de regalo». Su router añade `TiendaListaRegalos = RouterFactoryTiendaListaRegalos`. No añade el resto de `tienda_admin` (artículos web, categorías, pedidos y configuración).
