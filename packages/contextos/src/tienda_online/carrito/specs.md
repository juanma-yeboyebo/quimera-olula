# Tienda online — carrito

Página `/carrito`: líneas del carrito guardado, cambio de cantidad, borrado de líneas, totales y paso al checkout. El precio y el stock los calcula siempre el servidor; tras cada cambio se vuelve a leer el carrito.

API del backend (`olula_servidor`, app `tienda_online`). Todas las llamadas envían `X-Store-View`.

| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/public/tienda_online/carrito/<token>` | `{datos: CarritoPublico}`; 404 si no existe |
| PATCH | `/public/tienda_online/carrito/<token>/linea/<linea_id>` | body `{cantidad}`; 400 (stock insuficiente con el disponible en el texto, cantidad no válida), 404, 409 (carrito no modificable) |
| DELETE | `/public/tienda_online/carrito/<token>/linea/<linea_id>` | 404, 409 |

Modificar un carrito en `PAGO_PENDIENTE` lo devuelve a `ABIERTO` y anula la sesión de pago.

## Specs

### Carga

<!-- [carrito-carga-01] [nueva] -->
La página `/carrito` muestra el carrito del almacén (`useCarritoTienda`) y al entrar llama a `recargarCarrito()` para tener precios y estado actualizados.

<!-- [carrito-carga-02] [nueva] -->
Sin carrito o con el carrito sin líneas se muestra «Tu carrito está vacío» con un enlace al catálogo.

<!-- [carrito-carga-03] [nueva] -->
Si el carrito está en `PAGO_PENDIENTE` se muestra el aviso «Tienes un pago iniciado. Si modificas el carrito, tendrás que volver a pagar.»

### Líneas

<!-- [carrito-lineas-01] [nueva] -->
Cada línea muestra la imagen (o un marcador), la descripción enlazada a `/producto/<slug>` (sin enlace si `slug` es nulo), el precio unitario, el descuento si es mayor que 0, la cantidad y el importe, formateados con `formatearPrecio` y el idioma del storeview.

<!-- [carrito-lineas-02] [nueva] -->
La cantidad se cambia con botones «−» y «+» y con un campo numérico. Una función pura `cantidadValida(valor)` acepta solo números mayores que 0. El campo envía el cambio al perder el foco o con Intro; los botones lo envían al momento. «−» con cantidad 1 no hace nada (para quitar la línea está el botón de borrar).

<!-- [carrito-lineas-03] [nueva] -->
[LISTO] cantidad_cambiada → ACTUALIZANDO → LISTO (envía `PATCH …/linea/<id>` con `{cantidad}` y llama a `recargarCarrito()`)

<!-- [carrito-lineas-04] [nueva] -->
[LISTO] linea_borrada → ACTUALIZANDO → LISTO (envía `DELETE …/linea/<id>` y llama a `recargarCarrito()`). El borrado no pide confirmación.

<!-- [carrito-lineas-05] [nueva] -->
[ACTUALIZANDO] error 400 → LISTO (muestra el texto del backend, p. ej. stock insuficiente, y recarga el carrito para que la cantidad mostrada sea la guardada)

<!-- [carrito-lineas-06] [nueva] -->
[ACTUALIZANDO] error 404 o 409 → LISTO (el carrito ya no es válido o no es modificable: llama a `olvidarCarrito()` y muestra «Este carrito ya no está disponible»)

<!-- [carrito-lineas-07] [nueva] -->
Mientras está en `ACTUALIZANDO`, los botones de cantidad y borrado están deshabilitados.

### Totales y checkout

<!-- [carrito-totales-01] [nueva] -->
Se muestran la base imponible (`neto`), el IVA (`totalIva`) y el total (`total`) del carrito, con `formatearPrecio`.

<!-- [carrito-totales-02] [nueva] -->
El botón «Tramitar pedido» enlaza a `/checkout`. No se muestra con el carrito vacío.
