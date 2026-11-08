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
La ruta `/catalogo` muestra el catálogo completo (la ruta `/` es la página de inicio). La ruta `/categoria/<slug>` muestra el catálogo filtrado por esa categoría (incluye sus subcategorías, lo resuelve el backend).

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
El texto de búsqueda sale del parámetro `texto` de la URL, que rellena el buscador de la cabecera (ver `tienda-cabecera-04`), y filtra con `["texto", "~", valor]`. La página ya no tiene campo de búsqueda propio. Con texto, el título es «Resultados de «<texto>»» y aparece el enlace «Quitar búsqueda», que quita `texto` de la URL y conserva el resto de filtros. Sin texto no se envía filtro de texto.

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
Cada tarjeta muestra la imagen principal con `ImagenProducto` (con su `alt`, o la descripción si `alt` es nulo), la descripción, la descripción corta en una sola línea con el color suave y el precio con `PrecioTienda`. Toda la tarjeta enlaza a `/producto/<slug>`. No tiene borde: la foto lleva el radio `tarjeta` y crece un poco al pasar el ratón (salvo con `prefers-reduced-motion`).

<!-- [catalogo-tarjeta-02] [x] -->
El precio que se muestra es `precioConIva`, formateado con la divisa del producto y el idioma del storeview (`Intl.NumberFormat`, p. ej. «12,10 €»).

<!-- [catalogo-tarjeta-03] [x] -->
Si el producto no está disponible (`disponible = false`), la tarjeta muestra sobre la foto el `DistintivoTienda` `agotado` con el texto «Agotado», y la foto se atenúa. Los productos con `sinControlStock` siempre se muestran disponibles.

<!-- [catalogo-tarjeta-04] [x] -->
Los productos destacados muestran sobre la foto el `DistintivoTienda` `neutro` con el texto «Destacado».

<!-- [catalogo-tarjeta-05] [x] -->
La tarjeta expone el slot de factory `tarjeta_producto_acciones` (vacío por defecto), reservado para el botón de lista de deseos.

<!-- [catalogo-tarjeta-06] [nueva] -->
Si el producto está disponible (`estaDisponible`), la tarjeta tiene un botón redondo con el icono `carrito` y `aria-label` «Añadir <descripción> al carrito», sobre la esquina inferior derecha de la foto. Es hermano del enlace de la tarjeta (no va dentro del `<a>`) y se coloca con `position: absolute` en la fila de la foto de la subgrid, sin alterar la alineación. Es visible al pasar el ratón o con el foco dentro de la tarjeta; en dispositivos sin hover (`hover: none`) es visible siempre y más pequeño. No se muestra si el producto no está disponible. Convive con el slot `tarjeta_producto_acciones`.

<!-- [catalogo-tarjeta-07] [nueva] -->
Al pulsar el botón se añade 1 unidad con el mismo flujo que la ficha (`anadirLineaAlCarrito`: asegura el carrito, envía la línea, reintenta una vez ante 404/409 y recarga el carrito), con el botón deshabilitado mientras añade. No abre el cajón. Con éxito muestra el aviso `ok` «<descripción> añadido al carrito» con la acción «Ver carrito», que abre el cajón; con error, un aviso `error` con el texto del backend o «No se ha podido añadir al carrito».

### Diseño

<!-- [catalogo-diseño-01] [x] -->
La parte de arriba del catálogo muestra:
- las migas (`catalogo-categorias-04`, también sin categoría: «Inicio › Catálogo»);
- el título con la fuente de títulos: la categoría, «Todo el catálogo» o los resultados de la búsqueda;
- junto al título, «N productos» en color suave;
- a la derecha, el selector de orden y el interruptor «Solo destacados».

En pantallas de 860 px o menos, el orden y el interruptor bajan debajo del título.

<!-- [catalogo-diseño-02] [x] -->
El árbol lateral muestra «Todo» arriba y despliega solo la rama de la categoría activa. Los enlaces van con el color suave, y la categoría activa con el color de texto en seminegrita. En pantallas de 860 px o menos, el árbol se oculta: se navega con el menú de la cabecera.

<!-- [catalogo-diseño-03] [x] -->
La rejilla de productos usa columnas de 220 px como mínimo, que pasan a 2 en pantallas de 860 px o menos.
- **Debajo de la rejilla:** «Has visto X de N productos» y, si quedan más, el `BotonTienda` `secundario` «Ver más», centrado.
- **Mientras carga la primera página:** se muestran 8 tarjetas de esqueleto en lugar de «Cargando catálogo...».
- **Si falla la carga:** el reintento es un `BotonTienda`.

<!-- [catalogo-diseño-04] [x] -->
Los CSS del catálogo y de la tarjeta usan solo tokens `--tienda-*`. Las reglas del catálogo van en `@layer tienda.paginas` y las de la tarjeta en `@layer tienda.componentes`.


<!-- [catalogo-diseño-05] [x] -->
Todas las tarjetas de una fila miden lo mismo hasta el precio: la foto mantiene siempre la proporción `--tienda-ratio-foto`, el nombre ocupa como máximo dos líneas (se corta con «…» si es más largo) y la descripción corta una. Las tarjetas usan `subgrid` sobre las filas de la rejilla, de modo que en cada fila el nombre ocupa lo que el más alto de esa fila: si todos caben en una línea no queda hueco, y el precio queda alineado. Las columnas de la rejilla tienen todas el mismo ancho, sea cual sea el tamaño de las fotos.
