# Tienda online — inicio

Página de entrada de la tienda: portada, categorías de primer nivel, productos destacados y bloque de ventajas. Usa los primitivos, los tokens y los huecos de `comun/`.

API del backend: la misma del catálogo (`GET /public/tienda_online/catalogo` y `GET /public/tienda_online/categoria`).

## Specs

### Ruta

<!-- [inicio-ruta-01] [nueva] -->
La ruta `/` muestra `InicioTienda` (`inicio/InicioTienda.tsx`). Si el storeview no está configurado o no existe, muestra el mismo error que hoy muestra el catálogo (`ConStoreView`).

### Portada

<!-- [inicio-portada-01] [nueva] -->
La portada es el hueco `inicio_portada` de `FactoryTiendaOnline`, `null` por defecto. La portada base muestra:
- a un lado, el nombre del website como título, el texto «Descubre nuestro catálogo» y el botón principal «Ver el catálogo», que lleva a `/catalogo`;
- al otro, la foto `<ruta_imagenes_inicio>/portada.jpg`. `ruta_imagenes_inicio` está en la factory y vale `/inicio` por defecto, y esa carpeta no se sube al repositorio.

Si la foto no existe, el texto ocupa todo el ancho. En pantallas de 860 px o menos, la foto va encima del texto.

### Categorías

<!-- [inicio-categorias-01] [nueva] -->
La sección «Comprar por categoría» muestra las categorías de primer nivel (8 como máximo), con `useCategoriasTienda()`.
- Cada una es una tarjeta con la foto `<ruta_imagenes_categoria>/<slug>.jpg` (ver `tienda-menu-09`) y el nombre, y enlaza a `/categoria/<slug>`.
- Sin foto, la tarjeta muestra el nombre sobre el color `superficie-hundida`.
- Sin categorías, la sección no aparece.
- Rejilla de 4 columnas, que pasan a 2 en pantallas de 860 px o menos.

### Destacados

<!-- [inicio-destacados-01] [nueva] -->
La sección «Destacados» muestra hasta 8 productos destacados del catálogo (filtro `destacado`, orden por defecto) con la misma `TarjetaProducto` del catálogo. Lleva el enlace «Ver todo», que va a `/catalogo?destacados=1`. Sin destacados, la sección no aparece.

### Ventajas

<!-- [inicio-ventajas-01] [nueva] -->
Después de los destacados se pinta el hueco `inicio_ventajas` de la factory, `null` por defecto, para que cada cliente ponga sus mensajes (envío, devoluciones, pago). Con `null` no se pinta nada.
