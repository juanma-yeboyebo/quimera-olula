# Tienda online — checkout y pago

Datos del comprador, revisión, redirección a la pasarela (Stripe Checkout) y páginas de vuelta `/checkout/ok` y `/checkout/cancelado`. El pago lo confirma el webhook en el servidor, nunca el frontend.

API del backend (`olula_servidor`, app `tienda_online`). Todas las llamadas envían `X-Store-View`.

| Método | Ruta | Respuesta |
|---|---|---|
| PATCH | `/public/tienda_online/carrito/<token>/checkout` | body `{email, nombre, id_fiscal, telefono, direccion_facturacion, direccion_envio, id_forma_pago, id_forma_envio}`; 400 email no válido o forma no válida, 404, 409 |
| POST | `/public/tienda_online/carrito/<token>/pago` | `{url}`; 400 (carrito vacío, datos incompletos con la lista en el texto, stock insuficiente), 404, 409, 500 (pasarela) |
| POST | `/public/tienda_online/carrito/<token>/confirmar` | `{}`; para formas de pago sin pasarela. Mismos 400, 404 y 409 que `…/pago` |
| POST | `/public/tienda_online/carrito/<token>/pago/cancelar` | `{}`; si ya estaba `ABIERTO` no hace nada |
| GET | `/public/tienda_online/carrito/<token>` | `{datos: CarritoPublico}` con `estado` y `documento {tipo, id, codigo}` |

- Dirección: `{nombre_via, tipo_via, numero, otros, cod_postal, ciudad, provincia, pais_id, telefono}`. Para pagar son obligatorios email, nombre y, de la dirección de facturación, `nombre_via`, `cod_postal`, `ciudad` y `pais_id`.
- Las formas de pago y envío disponibles vienen en el StoreView (`formas_pago` y `formas_envio`: id, código, nombre, descripción y tipo). Tipos de pago: `PASARELA` y `SIN_PASARELA`. Tipos de envío: `DOMICILIO` y `RECOGIDA`.
- El carrito trae `forma_pago` y `forma_envio` (id, nombre y tipo) o nulo, y un estado nuevo, `CONFIRMADO`.
- El carrito trae también `formas_pago_disponibles` y `formas_envio_disponibles` (mismos campos que las del StoreView): las que admite ese carrito, que una extensión puede haber filtrado.
- La pasarela devuelve al comprador a `<url_base>/checkout/ok?sesion=…` o `<url_base>/checkout/cancelado`.

## Specs

### Datos

<!-- [checkout-datos-01] [x] -->
La ruta `/checkout` muestra el formulario con email, nombre, NIF (opcional), teléfono (opcional) y la dirección de facturación (vía, número, otros, código postal, ciudad, provincia y país, con `ES` por defecto). Si el carrito ya tiene `datosCheckout`, el formulario empieza con esos valores.

<!-- [checkout-datos-02] [x] -->
La casilla «Enviar a otra dirección» (desmarcada por defecto) muestra una segunda dirección con los mismos campos. Desmarcada, `direccion_envio` se envía como `null`.

<!-- [checkout-datos-03] [x] -->
Validación en el cliente (`MetaModelo` o función pura `erroresCheckout(datos)`): email con formato válido; nombre, vía, código postal, ciudad y país obligatorios; si hay dirección de envío, los mismos obligatorios en ella. Con errores no se avanza y cada campo muestra el suyo.

<!-- [checkout-datos-04] [x] -->
Sin carrito o con el carrito vacío, `/checkout` redirige a `/carrito`.

<!-- [checkout-datos-05] [nueva] -->
Un `fieldset` «Envío» lista las formas de envío disponibles del carrito (`formas_envio_disponibles`) como opciones de radio, con el nombre y, debajo, la descripción. Empieza marcada la del carrito o, si no tiene, la primera.

<!-- [checkout-datos-06] [nueva] -->
Con una forma de envío de tipo `RECOGIDA` se ocultan la casilla «Enviar a otra dirección» y la dirección de envío, y `direccion_envio` se envía como `null`.

<!-- [checkout-datos-07] [nueva] -->
Un `fieldset` «Pago» lista las formas de pago disponibles del carrito (`formas_pago_disponibles`) igual que el de envío. Empieza marcada la del carrito o, si no tiene, la primera.

<!-- [checkout-datos-08] [nueva] -->
`PATCH …/checkout` envía también `id_forma_pago` e `id_forma_envio`.

<!-- [checkout-datos-09] [nueva] -->
Si el carrito solo tiene disponible una forma de envío o una de pago, su `fieldset` muestra esa forma como texto, sin radio.

### Máquina

```mermaid
stateDiagram-v2
    [*] --> DATOS
    DATOS --> GUARDANDO : continuar
    GUARDANDO --> REVISION : datos guardados
    GUARDANDO --> DATOS : error
    REVISION --> DATOS : volver
    REVISION --> PAGANDO : pagar
    PAGANDO --> REDIRIGIENDO : url recibida
    PAGANDO --> DATOS : error 400
    PAGANDO --> REVISION : otro error
    REVISION --> CONFIRMANDO : confirmar
    CONFIRMANDO --> CONFIRMADO_OK : confirmado
    CONFIRMANDO --> DATOS : error 400
    CONFIRMANDO --> REVISION : otro error
```

<!-- [checkout-maquina-01] [x] -->
[DATOS] continuar → GUARDANDO → REVISION (envía `PATCH …/checkout` con los datos en snake_case y recarga el carrito)

<!-- [checkout-maquina-02] [x] -->
[GUARDANDO] error → DATOS (muestra el texto del backend; con 404 o 409 llama a `olvidarCarrito()` y muestra «Este carrito ya no está disponible»)

<!-- [checkout-maquina-03] [cambiada] -->
En `REVISION` se muestran los datos introducidos, la forma de envío, un bloque «Pago» y los botones «Modificar datos» (vuelve a `DATOS`) y el de terminar. Con una forma de pago `PASARELA`, el bloque dice «Al pulsar «Pagar» irás a la página segura de la pasarela para introducir la tarjeta. Después volverás aquí.» y el botón es «Pagar X», con X el total formateado. Con `SIN_PASARELA`, el bloque muestra el nombre y la descripción de la forma de pago y el botón es «Confirmar pedido».
<!-- antes: siempre pasarela y «Pagar X» -->

<!-- [checkout-maquina-04] [x] -->
[REVISION] pagar → PAGANDO → REDIRIGIENDO (envía `POST …/pago`; antes de redirigir guarda el token en `sessionStorage` bajo `tienda_online.pago_en_curso.<codigo_storeview>` y después navega a la `url` recibida con `window.location.assign`)

<!-- [checkout-maquina-05] [x] -->
[PAGANDO] error 400 → DATOS (muestra el texto del backend: datos incompletos, carrito vacío o stock insuficiente, y recarga el carrito)

<!-- [checkout-maquina-06] [x] -->
[PAGANDO] otro error → REVISION (muestra «No se ha podido iniciar el pago. Inténtalo de nuevo.»; con 404 o 409 además llama a `olvidarCarrito()`)

<!-- [checkout-maquina-08] [nueva] -->
[REVISION] confirmar → CONFIRMANDO → CONFIRMADO_OK (envía `POST …/confirmar`; después guarda el token en `sessionStorage` igual que al pagar y navega a `/checkout/ok`)

<!-- [checkout-maquina-09] [nueva] -->
[CONFIRMANDO] error 400 → DATOS y otro error → REVISION, con los mismos textos y el mismo tratamiento de 404 y 409 que `PAGANDO`; el texto genérico es «No se ha podido confirmar el pedido. Inténtalo de nuevo.»

<!-- [checkout-maquina-07] [cambiada] -->
En `GUARDANDO`, `PAGANDO`, `REDIRIGIENDO`, `CONFIRMANDO` y `CONFIRMADO_OK` los botones están deshabilitados, para no iniciar dos pagos.
<!-- antes: no existían CONFIRMANDO ni CONFIRMADO_OK -->

### Vuelta: pago correcto

<!-- [checkout-ok-01] [x] -->
La página `/checkout/ok` toma el token de `sessionStorage` (`tienda_online.pago_en_curso.<codigo_storeview>`), porque el almacén del carrito descarta al arrancar los carritos `PAGADO` o `CONVERTIDO`. Sin token guardado muestra «No hay ningún pago en curso» con enlace al catálogo.

<!-- [checkout-ok-02] [cambiada] -->
La página no da el pago por bueno: lee el carrito cada 2 segundos, durante 60 segundos como máximo, hasta verlo en `PAGADO`, `CONFIRMADO`, `CONVERTIDO` o `ERROR_CONVERSION`. Una función pura `resultadoPago(estado)` devuelve `"CONFIRMADO"` (`PAGADO`, `CONFIRMADO`, `CONVERTIDO`), `"INCIDENCIA"` (`ERROR_CONVERSION`) o `"PENDIENTE"` (el resto).
<!-- antes: no existía el estado CONFIRMADO del carrito -->

<!-- [checkout-ok-03] [x] -->
Con `CONVERTIDO` muestra «¡Gracias por tu compra!» y el número de pedido (`documento.codigo`). Con `PAGADO` muestra «Pago recibido. Estamos preparando tu pedido.»

<!-- [checkout-ok-07] [nueva] -->
Si la forma de pago del carrito es `SIN_PASARELA`, los textos hablan de pedido y no de pago: con `CONVERTIDO`, «¡Gracias por tu pedido!» y el número de pedido; con `CONFIRMADO`, «Pedido recibido. Lo estamos preparando.»; con `ERROR_CONVERSION`, «Hemos recibido tu pedido, pero hemos tenido un problema al registrarlo. Lo revisaremos y te contactaremos por email.» Debajo se muestra la descripción de la forma de pago.

<!-- [checkout-ok-04] [x] -->
Con `ERROR_CONVERSION` muestra «Pago recibido. Hemos tenido un problema al registrar el pedido y lo revisaremos; te contactaremos por email.»

<!-- [checkout-ok-05] [x] -->
Al llegar a `CONFIRMADO` o `INCIDENCIA` se llama a `olvidarCarrito()` y se borra el token de `sessionStorage`, de modo que el contador de la cabecera vuelve a 0.

<!-- [checkout-ok-06] [x] -->
Si pasan los 60 segundos sin confirmación, se deja de consultar y se muestra «Estamos confirmando tu pago. Si se completa, recibirás tu pedido; puedes volver a esta página más tarde.» No se olvida el carrito.

### Vuelta: pago cancelado

<!-- [checkout-cancelado-01] [x] -->
La página `/checkout/cancelado` envía `POST …/pago/cancelar` con el token guardado (el del almacén o, si no hay, el de `sessionStorage`), borra el de `sessionStorage`, recarga el carrito y muestra «Has cancelado el pago. Tu carrito sigue disponible.» con un enlace a `/carrito`.

<!-- [checkout-cancelado-02] [x] -->
Si la cancelación falla (404 o 409), muestra «Has cancelado el pago.» sin la frase del carrito ni enlace al carrito y llama a `olvidarCarrito()`.

### Diseño

<!-- [checkout-diseño-01] [x] -->
`/checkout` tiene dos columnas: el formulario (o la revisión) a la izquierda y, a la derecha, un resumen del pedido fijo al hacer scroll, visible en `DATOS` y en `REVISION`. En 860 px o menos, una columna con el resumen arriba. Usa el contenedor centrado de las demás páginas.

<!-- [checkout-diseño-02] [x] -->
El resumen tiene el título «Resumen» y una línea por artículo con la imagen pequeña (o `SinImagen`), un distintivo con la cantidad sobre la imagen, la descripción y el importe; debajo, base imponible, IVA y el total destacado.

<!-- [checkout-diseño-03] [x] -->
El formulario se agrupa en `fieldset` sin borde con la leyenda en la fuente de títulos: «Contacto» (email y teléfono), «Facturación» (nombre, NIF y dirección) y, si está marcada la casilla, «Dirección de envío». Los campos van en dos columnas; email, vía y la casilla ocupan el ancho completo. En 480 px o menos, una columna.

<!-- [checkout-diseño-04] [x] -->
Los botones del checkout son `BotonTienda`: «Continuar» y «Pagar X» `principal` a lo ancho; «Modificar datos» `secundario`.

<!-- [checkout-diseño-05] [x] -->
Las páginas `/checkout/ok` y `/checkout/cancelado` muestran su contenido centrado en una tarjeta, con el título en la fuente de títulos y los enlaces como `BotonTienda`.

<!-- [checkout-diseño-07] [nueva] -->
Las opciones de envío y de pago son tarjetas a lo ancho con el radio a la izquierda, el nombre en negrita y la descripción debajo en color secundario; la marcada lleva el borde del color principal de la tienda.

<!-- [checkout-diseño-06] [x] -->
`CheckoutTienda.css`, `PagoOk.css` y `PagoCancelado.css` usan solo tokens `--tienda-*` y van en `@layer tienda.paginas`.
