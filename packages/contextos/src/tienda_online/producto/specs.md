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

<!-- [producto-carga-01] [x] -->
La ruta `/producto/<slug>` carga la ficha enviando `X-Carrito-Token` si hay carrito guardado, y la mapea a `FichaProducto` en camelCase (`descripcionCorta`, `descripcionLarga`, `metaTitulo`, `metaDescripcion`, `cantidadDisponible`, `sinControlStock`, `precioConIva`, `tipoIva`, `ivaIncluido`).

<!-- [producto-carga-02] [x] -->
[CARGANDO] ficha cargada → LISTO

<!-- [producto-carga-03] [x] -->
[CARGANDO] error 404 → NO_ENCONTRADO (mensaje «Este producto no está disponible» y enlace al catálogo)

<!-- [producto-carga-04] [x] -->
[CARGANDO] otro error → ERROR (mensaje genérico con «Reintentar»)

<!-- [producto-carga-05] [x] -->
Al cargar, el título del documento pasa a ser `metaTitulo` (o la descripción si es nulo) y se actualiza la etiqueta `meta[name=description]` con `metaDescripcion` (o la descripción corta).

### Contenido

<!-- [producto-contenido-01] [x] -->
La galería muestra primero la imagen con `principal = true` (o la primera de la lista) con `ImagenProducto` `prioritaria`, y permite cambiar a las demás con miniaturas.
- **Escritorio:** las miniaturas van en una columna a la izquierda de la foto.
- **Pantallas de 860 px o menos:** van en una fila debajo.
- **Miniatura activa:** se marca con `aria-pressed` y un borde del color de texto.
- **Una sola imagen:** no hay miniaturas.
- **Sin imágenes:** se ve `SinImagen`.

<!-- [producto-contenido-02] [x] -->
La descripción es el título de la ficha, con la fuente de títulos. La descripción corta va debajo del precio. La descripción larga va dentro de un desplegable «Descripción», abierto por defecto, como texto plano con saltos de línea (no se interpreta HTML).

<!-- [producto-contenido-03] [x] -->
Encima de la galería van las migas «Inicio › … › <categoría> › <descripción>». Se calculan con `rutaCategoria` sobre el árbol de `useCategoriasTienda()` a partir de la primera categoría del producto. Si esa categoría no está en el árbol, solo hay «Inicio › <descripción>». Las demás categorías del producto se muestran al final de la ficha como enlaces en forma de píldora a `/categoria/<slug>`.

<!-- [producto-contenido-04] [x] -->
El precio es `precioConIva`, con `PrecioTienda` `grande` y la leyenda «IVA incluido» en color suave.

<!-- [producto-contenido-05] [x] -->
El texto de disponibilidad lo da `textoDisponibilidad(ficha)` en `producto/dominio.ts`:
- «Agotado» si no está disponible;
- «Quedan N unidades» si tiene control de stock y `cantidadDisponible` está entre 1 y 5;
- «En stock» en el resto de casos, y siempre con `sinControlStock`.

Se muestra con un punto delante, verde (`exito`) si está disponible y del color de error si no.

<!-- [producto-contenido-06] [x] -->
La ficha expone el slot de factory `ficha_acciones` (vacío por defecto), reservado para la lista de deseos.

### Añadir al carrito

<!-- [producto-anadir-01] [x] -->
El selector de cantidad empieza en 1 y no admite valores menores que 1. Si el producto tiene control de stock, no admite valores mayores que `cantidadDisponible`.

<!-- [producto-anadir-02] [x] -->
La compra se hace con `SelectorCantidad` (mínimo 1 y, con control de stock, como máximo `cantidadDisponible`) y un `BotonTienda` `principal` «Añadir al carrito», en la misma fila. Si el producto no está disponible, el botón está deshabilitado y su texto es «Agotado».

<!-- [producto-anadir-03] [cambiada] -->
[LISTO] añadir → AÑADIENDO → LISTO (asegura el carrito con `asegurarCarrito()`, que lo crea si no existe; envía `POST …/carrito/<token>/linea` con `{articulo_id: referencia, cantidad}`; llama a `recargarCarrito()` para actualizar el contador de la cabecera, NO abre el cajón y muestra el aviso efímero «<descripción> añadido al carrito», sin acciones; el mensaje «Añadido al carrito» de la ficha se mantiene)
<!-- antes: el aviso llevaba la acción «Ver carrito», que abría el cajón -->

<!-- [producto-anadir-04] [x] -->
[AÑADIENDO] error 400 → LISTO (muestra el texto del backend, p. ej. stock insuficiente con las unidades disponibles; la cantidad no cambia)

<!-- [producto-anadir-05] [x] -->
[AÑADIENDO] error 404 o 409 → LISTO (el carrito guardado ya no es válido: se llama a `olvidarCarrito()`, se crea uno nuevo y se reintenta la línea una sola vez; si vuelve a fallar se muestra el error)

### Diseño

<!-- [producto-diseño-01] [x] -->
En escritorio, la ficha tiene dos columnas: la galería, algo más ancha, y la información, que se queda fija al hacer scroll mientras quepa en la pantalla. En pantallas de 860 px o menos, va todo en una columna.

<!-- [producto-diseño-02] [x] -->
En pantallas de 860 px o menos, abajo hay una barra fija con el precio y el `BotonTienda` «Añadir» (o «Agotado»). Hace lo mismo que el botón principal, y la página deja un hueco abajo para que la barra no tape el contenido.

<!-- [producto-diseño-03] [x] -->
El aviso «Añadido al carrito» y el error al añadir se muestran debajo del botón, en una caja con el color de éxito o de error. El aviso lleva el enlace «Ver carrito».

<!-- [producto-diseño-04] [x] -->
El CSS de la ficha usa solo tokens `--tienda-*` y va en `@layer tienda.paginas`.

