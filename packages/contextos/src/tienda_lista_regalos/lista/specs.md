# Listas de regalo — admin

Contexto `tienda_lista_regalos`: parte de quimera de la extensión de listas de regalo de la tienda. Este módulo es el admin de listas, para el personal de la tienda. Sigue la plantilla `_plantilla/modulo` con el delta `_con_lineas` y los componentes Q del ERP; no usa los estilos de la tienda.

Backend: extensión `tienda_lista_regalos` de `olula_servidor`, montada en la app `dulce_bebe`. Regla `tienda_lista_regalos.lista`.

| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/tienda_lista_regalos/lista?q=…` | `{datos: [{id, website_id, cliente_id, nombre_cliente, nombre, publicada, creada, lineas, unidades, vendidas}], total}` |
| GET | `/tienda_lista_regalos/lista/<id>` | `{datos: {id, website_id, cliente_id, nombre_cliente, nombre, descripcion, token, url, publicada, creada, lineas: [{id, referencia, descripcion, precio, cantidad, cantidad_vendida, pendiente, orden}]}}`; 404 |
| POST | `/tienda_lista_regalos/lista` | body `{id_website, cliente_id, nombre, descripcion}` → `{id}` |
| PATCH | `/tienda_lista_regalos/lista/<id>` | body `{nombre, descripcion, cliente_id, publicada}` |
| DELETE | `/tienda_lista_regalos/lista/<id>` | 400 si tiene unidades vendidas |
| POST | `/tienda_lista_regalos/lista/<id>/linea` | body `{referencia, cantidad, precio?}` → `{id}`; 400 artículo repetido, 404 artículo inexistente |
| PATCH | `/tienda_lista_regalos/lista/<id>/linea/<idlinea>` | body `{precio, cantidad, cantidad_vendida, orden}`; 400 cantidades no válidas |
| DELETE | `/tienda_lista_regalos/lista/<id>/linea/<idlinea>` | 400 si tiene unidades vendidas |

## Ficheros afectados

- `tienda_lista_regalos/factory.ts`, `menu.ts`, `router_factory.ts`.
- `tienda_lista_regalos/lista/`: `diseño.ts`, `dominio.ts`, `infraestructura.ts`, `maestro/`, `detalle/`, `crear/`, `borrar/`, `crear_linea/`, `cambiar_linea/`, `borrar_linea/`, `test/`.

## Specs

### Menú y rutas

<!-- [lista_regalos-menu-01] [nueva] -->
`tienda_lista_regalos/menu.ts` añade «Listas de regalo» (`/tienda_lista_regalos/lista`, regla `tienda_lista_regalos.lista`) dentro del área «Tienda online». `FactoryTiendaListaRegalos` lo expone como `menu`.

<!-- [lista_regalos-menu-02] [nueva] -->
`RouterFactoryTiendaListaRegalos` tiene la ruta `tienda_lista_regalos/lista` con `MaestroConDetalleListaRegalos`. Ninguna app lo incluye por defecto.

### Maestro

<!-- [lista_regalos-maestro-01] [nueva] -->
Listado paginado de las listas del website activo (el selector de website de `tienda_admin`) con nombre, cliente, distintivo «Publicada» o «Sin publicar» y «<vendidas> de <unidades> vendidas». Por defecto, de la más reciente a la más antigua.

<!-- [lista_regalos-maestro-02] [nueva] -->
Filtro de texto por nombre de la lista o nombre del cliente.

<!-- [lista_regalos-crear-01] [nueva] -->
«Nueva lista» abre un modal con cliente (selector de cliente de `ventas/comun/componentes`), nombre y descripción opcional. Crea la lista en el website activo y la abre en el detalle.

### Detalle

<!-- [lista_regalos-detalle-01] [nueva] -->
El detalle muestra el nombre de la lista con su distintivo de publicación y tres pestañas: «Datos», «Productos» y «Compartir». «Borrar» pide confirmación; si el servidor responde 400 porque hay unidades vendidas, lo muestra en el diálogo de errores.

<!-- [lista_regalos-datos-01] [nueva] -->
Pestaña «Datos»: cliente, nombre, descripción y el interruptor «Publicada». Guardar llama a PATCH de la lista.

<!-- [lista_regalos-productos-01] [nueva] -->
Pestaña «Productos»: tabla con las líneas en su orden: referencia, descripción, precio con IVA, cantidad, vendidas y pendiente. Una línea sin pendiente se marca como «Vendido».

<!-- [lista_regalos-productos-02] [nueva] -->
«Añadir producto» abre un modal con el artículo (selector de artículo de `ventas/comun/componentes`), la cantidad (por defecto 1) y el precio con IVA opcional, con el texto de ayuda «Si lo dejas vacío se usa el precio de la tarifa del cliente». El 400 de artículo repetido se muestra en el campo artículo.

<!-- [lista_regalos-productos-03] [nueva] -->
Al pulsar una línea se abre un modal para cambiar el precio, la cantidad y las vendidas. El 400 de cantidades no válidas se muestra en el modal.

<!-- [lista_regalos-productos-04] [nueva] -->
Cada línea tiene «Borrar» con confirmación. Si tiene unidades vendidas, el botón está deshabilitado con el texto «Tiene unidades vendidas».

<!-- [lista_regalos-productos-05] [nueva] -->
Las flechas «Subir» y «Bajar» de cada línea cambian su `orden` intercambiándolo con el de la línea vecina (dos PATCH) y recargan la lista.

<!-- [lista_regalos-compartir-01] [nueva] -->
Pestaña «Compartir»: el enlace público de la lista (`url` del detalle) en un campo de solo lectura, con «Copiar enlace» (portapapeles y aviso «Enlace copiado») y «Abrir» en una pestaña nueva. Si la lista no está publicada, avisa: «La lista no está publicada: el enlace no funcionará hasta que la publiques».
