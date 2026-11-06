# Tienda online — catálogo

Rejilla de productos del storeview activo, con búsqueda, filtro por categoría, destacados, orden y paginación «Ver más». Pantalla de cliente final: no es maestro-detalle (desviación declarada de la plantilla en la capa de vistas; se mantienen `diseño.ts`, `dominio.ts`, `infraestructura.ts` y máquina).

API del backend (`olula_servidor`, app `tienda_online`). Todas las llamadas envían `X-Store-View`.

| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/public/tienda_online/catalogo?q=<criteria>` | `{datos: ItemCatalogo[], total}`; 404 si el storeview no existe |
| GET | `/public/tienda_online/categoria` | `{datos: NodoCategoria[]}` (árbol de categorías visibles) |

- `ItemCatalogo`: `{referencia, slug, descripcion, descripcion_corta, imagen: {url, alt} | null, destacado, disponible, sin_control_stock, precio, precio_con_iva, tipo_iva, divisa, iva_incluido}`.
- `NodoCategoria`: `{id, nombre, slug, hijas: NodoCategoria[]}`.
- Criteria: filtros `["texto", "~", valor]`, `["categoria", "=", slug]`, `["destacado", "=", "true"]`; orden `["orden", "ASC"]`, `["precio", "ASC" | "DESC"]`, `["descripcion", "ASC"]`; paginación `{limite, pagina}` (24 por página; el backend recorta a 48).

## Specs

### Rutas

<!-- [catalogo-rutas-01] [x] -->
Las rutas `/` y `/catalogo` muestran el catálogo completo. La ruta `/categoria/<slug>` muestra el catálogo filtrado por esa categoría (incluye sus subcategorías, lo resuelve el backend).

<!-- [catalogo-rutas-02] [x] -->
Los filtros (texto, categoría, solo destacados) y el orden se reflejan en la URL (`?texto=…&orden=…&destacados=1`), de modo que recargar o compartir la URL muestra el mismo catálogo.

### Carga

<!-- [catalogo-carga-01] [x] -->
La consulta del catálogo siempre envía criteria con orden explícito (por defecto `["orden", "ASC"]`) y paginación `{limite: 24, pagina: N}`. Sin orden, `criteriaQuery` no genera la query y se perdería la paginación.

<!-- [catalogo-carga-02] [x] -->
La consulta del catálogo envía `X-Carrito-Token` si hay un carrito guardado, para que los precios sean los del cliente asociado al carrito.

<!-- [catalogo-carga-03] [x] -->
El ítem de la API se mapea a `ProductoCatalogo { referencia, slug, descripcion, descripcionCorta, imagen, destacado, disponible, sinControlStock, precio, precioConIva, tipoIva, divisa, ivaIncluido }`.

<!-- [catalogo-carga-04] [x] -->
[CARGANDO] catálogo cargado → LISTO (muestra la primera página y el total de resultados)

<!-- [catalogo-carga-05] [x] -->
[CARGANDO] error al cargar → ERROR (mensaje «No se ha podido cargar el catálogo» con botón «Reintentar»)

### Paginación

<!-- [catalogo-paginacion-01] [x] -->
Mientras el número de productos cargados sea menor que `total`, se muestra el botón «Ver más», que pide la página siguiente y **añade** sus productos a los ya mostrados (no los sustituye).

<!-- [catalogo-paginacion-02] [x] -->
Al cambiar cualquier filtro o el orden se vuelve a la página 1 y se sustituyen los productos mostrados.

<!-- [catalogo-paginacion-03] [x] -->
Si la página siguiente devuelve productos que ya están en la lista (misma `referencia`), no se duplican.

### Búsqueda, filtros y orden

<!-- [catalogo-filtros-01] [x] -->
El buscador de texto filtra con `["texto", "~", valor]`. Se aplica al pulsar Intro o tras 400 ms sin teclear; con el texto vacío no se envía filtro de texto.

<!-- [catalogo-filtros-02] [x] -->
El selector de orden ofrece «Relevancia» (`orden ASC`, por defecto), «Precio: menor a mayor», «Precio: mayor a menor» y «Nombre».
<!-- nota: el backend ordena por precio usando articulos.pvp, no el precio del cliente; puede no coincidir exactamente con el precio mostrado -->

<!-- [catalogo-filtros-03] [x] -->
La casilla «Solo destacados» añade `["destacado", "=", "true"]`.

<!-- [catalogo-filtros-04] [x] -->
Sin resultados se muestra «No hay productos que coincidan con la búsqueda» y un enlace «Ver todo el catálogo» que limpia los filtros.

### Categorías

<!-- [catalogo-categorias-01] [x] -->
Junto al catálogo se muestra el árbol de categorías (`GET /public/tienda_online/categoria`), mapeado a `CategoriaTienda { id, nombre, slug, hijas }`. Cada categoría enlaza a `/categoria/<slug>`.

<!-- [catalogo-categorias-02] [x] -->
La categoría activa (la de la URL) se resalta, y sus ancestros aparecen desplegados. Una función pura `rutaCategoria(arbol, slug)` devuelve la lista de nodos desde la raíz hasta la categoría (vacía si no existe).

<!-- [catalogo-categorias-03] [x] -->
Si el slug de la URL no existe en el árbol, se muestra el catálogo vacío con el mensaje de «sin resultados»; no es un error.

<!-- [catalogo-categorias-04] [x] -->
En la cabecera del catálogo filtrado se muestra la miga de pan «Inicio › Categoría padre › Categoría» a partir de `rutaCategoria`.

### Tarjeta de producto

<!-- [catalogo-tarjeta-01] [x] -->
Cada tarjeta muestra la imagen principal (con su `alt`, o la descripción si `alt` es nulo; un marcador neutro si no hay imagen), la descripción, la descripción corta y el precio. Toda la tarjeta enlaza a `/producto/<slug>`.

<!-- [catalogo-tarjeta-02] [x] -->
El precio que se muestra es `precioConIva`, formateado con la divisa del producto y el idioma del storeview (`Intl.NumberFormat`, p. ej. «12,10 €»).

<!-- [catalogo-tarjeta-03] [x] -->
Si el producto no está disponible (`disponible = false`) la tarjeta muestra «Sin stock». Los productos con `sinControlStock` siempre se muestran disponibles.

<!-- [catalogo-tarjeta-04] [x] -->
Los productos destacados muestran el distintivo «Destacado».

<!-- [catalogo-tarjeta-05] [x] -->
La tarjeta expone el slot de factory `tarjeta_producto_acciones` (vacío por defecto), reservado para el botón de lista de deseos.
