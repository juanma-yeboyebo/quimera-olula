# Tienda online — ficha de producto

Ficha de un producto publicado, accesible por su slug, con galería, textos web, categorías, precio, disponibilidad y el botón «Añadir al carrito».

API del backend (`olula_servidor`, app `tienda_online`). Todas las llamadas envían `X-Store-View`.

| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/public/tienda_online/producto/<slug>` | `{datos: Producto}`; 404 si no existe, no está publicado o es de otro website |
| POST | `/public/tienda_online/carrito` | `{token}` |
| POST | `/public/tienda_online/carrito/<token>/linea` | body `{articulo_id: referencia, cantidad}` → `{id}`; 400 (no publicado, stock insuficiente con el disponible en el texto, cantidad no válida), 404 (carrito inexistente), 409 (carrito no modificable) |

- `Producto`: `{referencia, slug, descripcion, descripcion_corta, descripcion_larga, meta_titulo, meta_descripcion, imagenes: [{url, alt, principal}], categorias: [{id, nombre, slug}], disponible, cantidad_disponible, sin_control_stock, precio, precio_con_iva, tipo_iva, divisa, iva_incluido}`.

## Specs

### Carga

<!-- [producto-carga-01] [nueva] -->
La ruta `/producto/<slug>` carga la ficha enviando `X-Carrito-Token` si hay carrito guardado, y la mapea a `FichaProducto` en camelCase (`descripcionCorta`, `descripcionLarga`, `metaTitulo`, `metaDescripcion`, `cantidadDisponible`, `sinControlStock`, `precioConIva`, `tipoIva`, `ivaIncluido`).

<!-- [producto-carga-02] [nueva] -->
[CARGANDO] ficha cargada → LISTO

<!-- [producto-carga-03] [nueva] -->
[CARGANDO] error 404 → NO_ENCONTRADO (mensaje «Este producto no está disponible» y enlace al catálogo)

<!-- [producto-carga-04] [nueva] -->
[CARGANDO] otro error → ERROR (mensaje genérico con «Reintentar»)

<!-- [producto-carga-05] [nueva] -->
Al cargar, el título del documento pasa a ser `metaTitulo` (o la descripción si es nulo) y se actualiza la etiqueta `meta[name=description]` con `metaDescripcion` (o la descripción corta).

### Contenido

<!-- [producto-contenido-01] [nueva] -->
La galería muestra primero la imagen con `principal = true` (o la primera de la lista) y permite cambiar a las demás con miniaturas. Sin imágenes se muestra un marcador neutro.

<!-- [producto-contenido-02] [nueva] -->
Se muestran la descripción, la descripción corta y la descripción larga. La descripción larga se muestra como texto plano con saltos de línea (no se interpreta HTML).

<!-- [producto-contenido-03] [nueva] -->
Las categorías del producto se muestran como enlaces a `/categoria/<slug>`.

<!-- [producto-contenido-04] [nueva] -->
El precio mostrado es `precioConIva` con la divisa y el idioma del storeview (mismo formateador que el catálogo), con la leyenda «IVA incluido».

<!-- [producto-contenido-05] [nueva] -->
La disponibilidad se muestra como «Disponible» o «Sin stock». Con `sinControlStock` siempre «Disponible».

<!-- [producto-contenido-06] [nueva] -->
La ficha expone el slot de factory `ficha_acciones` (vacío por defecto), reservado para la lista de deseos.

### Añadir al carrito

<!-- [producto-anadir-01] [nueva] -->
El selector de cantidad empieza en 1 y no admite valores menores que 1. Si el producto tiene control de stock, no admite valores mayores que `cantidadDisponible`.

<!-- [producto-anadir-02] [nueva] -->
Si el producto no está disponible, el botón «Añadir al carrito» está deshabilitado.

<!-- [producto-anadir-03] [nueva] -->
[LISTO] añadir → AÑADIENDO → LISTO (asegura el carrito con `asegurarCarrito()`, que lo crea si no existe; envía `POST …/carrito/<token>/linea` con `{articulo_id: referencia, cantidad}`; llama a `recargarCarrito()` para actualizar el contador de la cabecera y muestra «Añadido al carrito» con enlace a `/carrito`)

<!-- [producto-anadir-04] [nueva] -->
[AÑADIENDO] error 400 → LISTO (muestra el texto del backend, p. ej. stock insuficiente con las unidades disponibles; la cantidad no cambia)

<!-- [producto-anadir-05] [nueva] -->
[AÑADIENDO] error 404 o 409 → LISTO (el carrito guardado ya no es válido: se llama a `olvidarCarrito()`, se crea uno nuevo y se reintenta la línea una sola vez; si vuelve a fallar se muestra el error)
