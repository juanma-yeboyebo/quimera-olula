# Administración de la tienda — formas de pago

Qué formas de pago ofrece cada website en el checkout y, para las de tarjeta, en qué cuenta de Stripe cobran. La cuenta es una credencial «Stripe» de Credenciales (`comun/credencial_externa`); aquí solo se elige. Sigue la plantilla `_plantilla/modulo`. Regla `tienda_admin.forma_pago`.

| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/tienda_admin/forma_pago?website_id=<id>` | `{datos: [{id, website_id, codigo, nombre, descripcion, tipo, codpago, orden, activo, credencial: {id, nombre} \| null}]}` |
| GET | `/tienda_admin/forma_pago/<id>` | lo mismo y `conexion: {modo, test, live} \| null`; 404 |
| POST | `/tienda_admin/forma_pago` | body `{website_id, codigo, nombre, descripcion, tipo, codpago, credencial_id}` → `{id}`; 400, 404, 409 |
| PATCH | `/tienda_admin/forma_pago/<id>` | body `{nombre, descripcion, codpago, credencial_id, orden, activo}` → `{}`; 400, 404 |
| POST | `/tienda_admin/forma_pago/<id>/probar_conexion` | `{test, live}`; 400 con el motivo |
| GET | `/comun/credencial-externa` | credenciales, para el selector (solo las de proveedor «Stripe» activas) |

## Ficheros afectados

- `tienda_admin/menu.ts`, `router_factory.ts`.
- `tienda_admin/forma_pago/`: `diseño.ts`, `dominio.ts`, `infraestructura.ts`, `maestro/`, `detalle/`, `crear/`, `test/`.

## Specs

<!-- [tienda_admin-forma_pago-menu-01] [x] -->
`menuTiendaAdmin` añade «Tienda online › Formas de pago» (`/tienda_admin/forma_pago`, regla `tienda_admin.forma_pago`) y `RouterFactoryTiendaAdmin` la ruta con `MaestroConDetalleFormaPago`.

<!-- [tienda_admin-forma_pago-maestro-01] [x] -->
Listado de las formas de pago del website activo (selector de website de `tienda_admin`) en su orden: nombre, código, distintivo «Tarjeta» (`PASARELA`) o «Sin pago online» (`SIN_PASARELA`), distintivo «Inactiva» si no está activa y, en las de tarjeta, el nombre de la credencial o «Sin cuenta de Stripe».

<!-- [tienda_admin-forma_pago-crear-01] [x] -->
«Nueva forma de pago» abre un modal con tipo («Tarjeta» o «Sin pago online», p. ej. pago en tienda), código, nombre, descripción opcional, forma de pago del ERP (selector `FormaPago` de `comun/componentes`) y, si es de tarjeta, la cuenta de Stripe (selector con las credenciales Stripe activas). Crea en el website activo y abre la nueva en el detalle. El 409 se muestra en el campo código.

<!-- [tienda_admin-forma_pago-detalle-01] [x] -->
El detalle muestra código y tipo (solo lectura) y edita nombre, descripción, forma de pago del ERP, cuenta de Stripe (solo en las de tarjeta), orden y «Activa». Guardar llama a PATCH. No hay «Borrar»: para dejar de ofrecerla se desactiva.

<!-- [tienda_admin-forma_pago-conexion-01] [x] -->
En las de tarjeta con cuenta de Stripe, el detalle muestra el estado de la conexión: «Conectada» si el webhook del modo en uso está dado de alta, o «Sin conectar» y un aviso. «Comprobar conexión» llama a `probar_conexion`, recarga el estado y muestra el error del servidor en el diálogo de errores.

<!-- [tienda_admin-forma_pago-conexion-02] [x] -->
Si no hay ninguna credencial Stripe activa, el selector de cuenta está vacío y se muestra «No hay ninguna cuenta de Stripe. Créala en Administración › Credenciales», con enlace a `/comun/credencial-externa` si el usuario tiene la regla `comun.credencial_externa`.
