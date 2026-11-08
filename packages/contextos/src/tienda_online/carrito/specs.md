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

<!-- [carrito-carga-01] [x] -->
La página `/carrito` muestra el carrito del almacén (`useCarritoTienda`) y al entrar llama a `recargarCarrito()` para tener precios y estado actualizados.

<!-- [carrito-carga-02] [x] -->
Sin carrito o con el carrito sin líneas se muestra «Tu carrito está vacío» con un enlace al catálogo.

<!-- [carrito-carga-03] [x] -->
Si el carrito está en `PAGO_PENDIENTE` se muestra el aviso «Tienes un pago iniciado. Si modificas el carrito, tendrás que volver a pagar.»

### Líneas

<!-- [carrito-lineas-01] [x] -->
Cada línea muestra la imagen (o un marcador), la descripción enlazada a `/producto/<slug>` (sin enlace si `slug` es nulo), el precio unitario, el descuento si es mayor que 0, la cantidad y el importe, formateados con `formatearPrecio` y el idioma del storeview.

<!-- [carrito-lineas-02] [cambiada] -->
La cantidad se cambia con `SelectorCantidad` (`tienda-primitivos-07`): «−» y «+» envían el cambio al momento y el campo, al perder el foco o con Intro, validado con `cantidadValida`. «−» está deshabilitado con cantidad 1 (para quitar la línea está «Quitar»).
<!-- antes: botones y campo numérico propios de la línea; `cantidadValida` estaba en `carrito/dominio.ts` -->

<!-- [carrito-lineas-03] [x] -->
[LISTO] cantidad_cambiada → ACTUALIZANDO → LISTO (envía `PATCH …/linea/<id>` con `{cantidad}` y llama a `recargarCarrito()`)

<!-- [carrito-lineas-04] [x] -->
[LISTO] linea_borrada → ACTUALIZANDO → LISTO (envía `DELETE …/linea/<id>` y llama a `recargarCarrito()`). El borrado no pide confirmación.

<!-- [carrito-lineas-05] [x] -->
[ACTUALIZANDO] error 400 → LISTO (muestra el texto del backend, p. ej. stock insuficiente, y recarga el carrito para que la cantidad mostrada sea la guardada)

<!-- [carrito-lineas-06] [x] -->
[ACTUALIZANDO] error 404 o 409 → LISTO (el carrito ya no es válido o no es modificable: llama a `olvidarCarrito()` y muestra «Este carrito ya no está disponible»)

<!-- [carrito-lineas-07] [x] -->
Mientras está en `ACTUALIZANDO`, los botones de cantidad y borrado están deshabilitados.

### Totales y checkout

<!-- [carrito-totales-01] [x] -->
Se muestran la base imponible (`neto`), el IVA (`totalIva`) y el total (`total`) del carrito, con `formatearPrecio`.

<!-- [carrito-totales-02] [x] -->
El botón «Tramitar pedido» enlaza a `/checkout`. No se muestra con el carrito vacío.

### Cajón

<!-- [carrito-cajon-01] [nueva] -->
`LayoutTienda` monta un cajón lateral derecho del carrito, con un velo detrás, fuera de las rutas `/checkout*`. Su estado está en `comun/cajon_carrito_store.ts` (`abrirCajonCarrito`, `cerrarCajonCarrito`, `useCajonCarrito`). El icono del carrito de la cabecera y la entrada «Carrito» del cajón del menú móvil lo abren en lugar de navegar a `/carrito`. Se cierra con el botón «Cerrar carrito» (icono `cerrar`), con el velo, con Escape y al cambiar de ruta. Al abrirse, el foco pasa al cajón.

<!-- [carrito-cajon-02] [nueva] -->
Al añadir un producto desde la ficha con éxito (`producto-anadir-03`) se abre el cajón. El aviso «Añadido al carrito» de la ficha se mantiene.

<!-- [carrito-cajon-03] [nueva] -->
El cajón muestra el título «Tu carrito (N)», con N las unidades, y una línea por artículo: imagen (o `SinImagen`), descripción enlazada a `/producto/<slug>` (sin enlace si `slug` es nulo), precio por unidad, `SelectorCantidad`, «Quitar» e importe. Cambiar la cantidad y quitar usan la misma máquina que la página `/carrito` (`carrito-lineas-03` a `07`).

<!-- [carrito-cajon-04] [nueva] -->
El pie del cajón muestra «Total» con `total`, la nota «IVA incluido.», un `BotonTienda` `principal` a lo ancho «Finalizar compra» (a `/checkout`), y un `BotonTienda` `enlace` «Seguir comprando» que cierra el cajón.

<!-- [carrito-cajon-05] [nueva] -->
Sin carrito o vacío, el cajón muestra «Tu carrito está vacío.» y un `BotonTienda` «Ver la colección» que lleva a `/catalogo` y cierra el cajón.

<!-- [carrito-cajon-06] [nueva] -->
Si el carrito está en `PAGO_PENDIENTE`, el cajón muestra el mismo aviso que la página (`carrito-carga-03`).

### Envío gratis

<!-- [carrito-envio-01] [nueva] -->
`FactoryTiendaOnline` tiene el valor `envio_gratis_desde: number | null`, `null` por defecto. Con `null` no se muestra nada de envío gratis.

<!-- [carrito-envio-02] [nueva] -->
Una función pura `progresoEnvioGratis(total, umbral)` en `carrito/dominio.ts` devuelve `{ falta, porcentaje }`: `falta` es `umbral − total` sin bajar de 0, y `porcentaje` es `total / umbral × 100` entre 0 y 100. Con `umbral` menor o igual que 0 devuelve `{ falta: 0, porcentaje: 100 }`.

<!-- [carrito-envio-03] [nueva] -->
Con umbral configurado, el cajón y la página `/carrito` muestran encima de las líneas «Te faltan X para el envío gratis.» (o «Tienes envío gratis.» si `falta` es 0) y una barra de progreso con `porcentaje`, de color `exito`. X se formatea con `formatearPrecio`.

### Diseño

<!-- [carrito-diseño-01] [nueva] -->
La página `/carrito` tiene dos columnas: las líneas y, a la derecha, un resumen fijo al hacer scroll con base imponible, IVA, total y el botón. En 860 px o menos, una columna con el resumen debajo. Usa el contenedor centrado de las demás páginas.

<!-- [carrito-diseño-02] [nueva] -->
Las líneas de la página usan los mismos primitivos que el cajón: `SelectorCantidad` para la cantidad (ver `carrito-lineas-02`), `PrecioTienda` para precio e importe y un `BotonTienda` `enlace` «Quitar». «Tramitar pedido» pasa a ser un `BotonTienda` `principal` a lo ancho.

<!-- [carrito-diseño-03] [nueva] -->
`CarritoTienda.css` y los estilos del cajón usan solo tokens `--tienda-*` y van en `@layer tienda.paginas` y `@layer tienda.componentes` respectivamente.
