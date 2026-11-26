# Listas de regalo — admin

Contexto `tienda_lista_regalos`: parte de quimera de la extensión de listas de regalo de la tienda. Este módulo es el admin de listas, para el personal de la tienda. Sigue la plantilla `_plantilla/modulo` con el delta `_con_lineas` y los componentes Q del ERP; no usa los estilos de la tienda.

Backend: extensión `tienda_lista_regalos` de `olula_servidor`, montada en la app `dulce_bebe`. Regla `tienda_lista_regalos.lista`.

| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/tienda_lista_regalos/lista?q=…` | `{datos: [{id, website_id, cliente: {codigo, nombre} \| null, nombre, publicada, creada, lineas, unidades, vendidas}], total}` |
| GET | `/tienda_lista_regalos/lista/<id>` | `{datos: {id, website_id, cliente: {codigo, nombre} \| null, nombre, descripcion, token, slug, codigo, url, publicada, creada, lineas: [{id, referencia, descripcion, precio, cantidad, cantidad_vendida, pendiente, orden, sin_control_stock, stock, entregada, estado_pago, estado_envio, imagen: {url, alt} \| null, dedicatoria}]}}`; 404 |
| POST | `/tienda_lista_regalos/lista` | body `{id_website, cliente_id?, nombre, descripcion, slug?, fecha?}` → `{id}`; 400 slug no válido |
| PATCH | `/tienda_lista_regalos/lista/<id>` | body `{nombre, descripcion, cliente_id, publicada, slug}`; 400 slug no válido o lista publicada |
| DELETE | `/tienda_lista_regalos/lista/<id>` | 400 si tiene unidades vendidas |
| POST | `/tienda_lista_regalos/lista/<id>/linea` | body `{referencia, precio?}` → `{id}`; 400 artículo repetido, 404 artículo inexistente |
| PATCH | `/tienda_lista_regalos/lista/<id>/linea/<idlinea>` | body `{precio, orden, entregada}`; 400 precio u orden negativos, o `entregada` sin línea de carrito |
| POST | `/tienda_lista_regalos/lista/<id>/linea/<idlinea>/liberar` | 400 si la línea no está reservada |
| DELETE | `/tienda_lista_regalos/lista/<id>/linea/<idlinea>` | 400 si tiene unidades vendidas |

## Ficheros afectados

- `tienda_lista_regalos/factory.ts`, `menu.ts`, `router_factory.ts`.
- `tienda_lista_regalos/lista/`: `diseño.ts`, `dominio.ts`, `infraestructura.ts`, `maestro/`, `detalle/`, `crear/`, `borrar/`, `crear_linea/`, `cambiar_linea/`, `borrar_linea/`, `liberar_linea/`, `test/`.

## Specs

### Menú y rutas

<!-- [lista_regalos-menu-01] [x] -->
`tienda_lista_regalos/menu.ts` añade «Listas de regalo» (`/tienda_lista_regalos/lista`, regla `tienda_lista_regalos.lista`) dentro del área «Tienda online». `FactoryTiendaListaRegalos` lo expone como `menu`.

<!-- [lista_regalos-menu-02] [x] -->
`RouterFactoryTiendaListaRegalos` tiene la ruta `tienda_lista_regalos/lista` con `MaestroConDetalleListaRegalos`. Ninguna app lo incluye por defecto.

### Maestro

<!-- [lista_regalos-maestro-01] [x] -->
<!-- antes: ... con nombre, cliente, distintivo ... -->
Listado paginado de las listas del website activo (el selector de website de `tienda_admin`) con nombre, cliente («Sin cliente» si no tiene), distintivo «Publicada» o «Sin publicar» y «<vendidas> de <unidades> vendidas». Por defecto, de la más reciente a la más antigua.

<!-- [lista_regalos-maestro-02] [x] -->
Filtro de texto por nombre de la lista o nombre del cliente.

<!-- [lista_regalos-maestro-03] [x] -->
Filtro por fecha de la lista, con «Desde» y «Hasta» opcionales. Se envía como `creada >= desde` y `creada < día siguiente a hasta`, para que entre todo el día de «Hasta». Lo construye `filtroListas`.

<!-- [lista_regalos-crear-01] [x] -->
«Nueva lista» abre un modal con nombre, «Dirección», «Fecha» (obligatoria, rellenada con el día de hoy), cliente opcional (selector de cliente de `ventas/comun/componentes`) y descripción opcional. Envía la fecha como `fecha`. Crea la lista en el website activo y la abre en el detalle.

<!-- [lista_regalos-direccion-01] [x] -->
La «Dirección» es el slug de la URL de la lista. Se rellena sola a partir del nombre mientras no se toque a mano, con las reglas del servidor: minúsculas, sin acentos, guiones en lugar de espacios y signos, máximo 150. Se valida con `errorSlug` de `tienda_admin/comun`. Debajo se ve la vista previa `…/lista/<dirección>-······` y el texto «Al final se añade un código para que nadie pueda adivinar la dirección».

### Detalle

<!-- [lista_regalos-detalle-01] [x] -->
El detalle muestra el nombre de la lista con su distintivo de publicación y tres pestañas: «Datos», «Productos» y «Compartir». «Borrar» pide confirmación; si el servidor responde 400 porque hay unidades vendidas, lo muestra en el diálogo de errores.

<!-- [lista_regalos-detalle-02] [x] -->
El menú de acciones del detalle (`QuimeraAcciones`, donde está «Borrar») añade, antes de «Borrar», «Publicar» si la lista no está publicada u «Ocultar lista» si lo está. Llaman a PATCH de la lista con `publicada: true` o `false`, sin confirmación, y recargan el detalle y el maestro, de modo que cambian el distintivo y la pestaña «Compartir».

<!-- [lista_regalos-datos-01] [x] -->
<!-- antes: Pestaña «Datos»: cliente, nombre y descripción. Guardar llama a PATCH de la lista. La publicación no se cambia aquí (`lista_regalos-compartir-01`). -->
Pestaña «Datos»: nombre, «Dirección», cliente opcional (se puede vaciar) y descripción. Guardar llama a PATCH de la lista. La publicación no se cambia aquí (`lista_regalos-compartir-01`).

<!-- [lista_regalos-direccion-02] [x] -->
En la pestaña «Datos», mientras la lista no está publicada, la «Dirección» se edita con las mismas reglas que al crearla. Debajo se ve la URL completa con el código de la lista (`…/lista/<dirección>-<código>`). Cambiar el nombre no cambia la dirección. Si la lista está publicada, la dirección es de solo lectura, con el texto «La dirección no se puede cambiar una vez publicada».

<!-- [lista_regalos-productos-01] [x] -->
Pestaña «Productos»: tabla con las líneas en su orden: miniatura de la foto, referencia, descripción, precio con IVA, estado de pago, estado de envío y dedicatoria. Ya no muestra cantidad, vendidas, pendiente ni stock.
- **Foto:** la `imagen` de la línea (`lista-consulta-10`) en miniatura, como en el maestro de artículos web de `tienda_admin`. Si no tiene, una `QEtiqueta` `advertencia` «Sin foto».
- **Estado de pago:** `QEtiqueta` «Pendiente» (`gris`), «Reservado» (`advertencia`), «Pagado tarjeta» o «Pagado TPV» (`exito`).
- **Estado de envío:** `QEtiqueta` «Pendiente» (`gris`), «Por entregar a comprador» o «Por entregar a padres» (`primario`), «Entregado» (`exito`).
- Los textos y variantes salen de funciones puras de `dominio.ts`.

<!-- [lista_regalos-productos-02] [x] -->
«Añadir producto» abre un modal con el artículo (selector de artículo de `ventas/comun/componentes`) y el precio con IVA opcional, con el texto de ayuda «Si lo dejas vacío se usa el precio de la tarifa del cliente o, si la lista no tiene cliente, el de la tienda». El 400 de artículo repetido se muestra en el campo artículo.

<!-- [lista_regalos-productos-03] [x] -->
Al pulsar una línea se abre un modal para cambiar el precio. El 400 se muestra en el modal.

<!-- [lista_regalos-productos-04] [x] -->
Cada línea tiene «Borrar» con confirmación. Si tiene unidades vendidas, el botón está deshabilitado con el texto «Tiene unidades vendidas».

<!-- [lista_regalos-productos-05] [x] -->
Las flechas «Subir» y «Bajar» de cada línea cambian su `orden` intercambiándolo con el de la línea vecina (dos PATCH) y recargan la lista.

<!-- [lista_regalos-productos-06] [x] -->
Encima de la tabla, tres importes con IVA, calculados en `dominio.ts` con una función pura a partir de las líneas:
- «Total de la lista»: suma de los precios de todas las líneas;
- «Vendido»: suma de las líneas con estado de pago distinto de «Pendiente», reservas incluidas;
- «Reservado sin pagar»: suma de las líneas «Reservado», que es parte de «Vendido».

<!-- [lista_regalos-productos-07] [x] -->
Una línea «Por entregar a comprador» o «Por entregar a padres» tiene la acción «Entregado», sin confirmación. Una línea «Entregado» tiene «Deshacer entrega». Llaman a PATCH de la línea con `entregada: true` o `false` y recargan la lista. Si el servidor responde 400, se muestra en el diálogo de errores.

<!-- [lista_regalos-productos-08] [x] -->
Una línea «Reservado» que no esté entregada tiene la acción «Liberar». Pide confirmación en un modal (`liberar_linea/LiberarLineaListaRegalos.tsx`, como `borrar_linea`) con el texto «El producto vuelve a quedar pendiente en la lista. La venta de TPV no se anula: anúlala en el TPV si hace falta». Al aceptar llama a POST `…/linea/<idlinea>/liberar` y recarga la lista. El 400 se muestra en el modal.

<!-- [lista_regalos-productos-09] [x] -->
Si la línea tiene `dedicatoria`, la columna «Dedicatoria» muestra una marca «Dedicatoria» con el texto como `title`, para verlo al pasar el ratón. Al pulsarla se abre un modal de solo lectura con el texto completo y «Cerrar». Pulsar la marca o las acciones no abre el modal de edición de la línea.

<!-- [lista_regalos-compartir-01] [x] -->
Pestaña «Compartir» de una lista publicada: el enlace público de la lista (`url` del detalle) en un campo de solo lectura, con «Copiar enlace» (portapapeles y aviso «Enlace copiado») y «Abrir» en una pestaña nueva.

<!-- [lista_regalos-compartir-02] [x] -->
Pestaña «Compartir» de una lista sin publicar: solo el aviso «La lista no está publicada: el enlace no funcionará hasta que la publiques» y el botón «Publicar». No muestra el enlace, «Copiar enlace» ni «Abrir». «Publicar» llama a PATCH de la lista con `publicada: true` y recarga el detalle, que pasa a mostrar el enlace (`lista_regalos-compartir-01`) y el distintivo «Publicada».
