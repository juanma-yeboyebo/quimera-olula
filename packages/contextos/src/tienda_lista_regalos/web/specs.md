# Listas de regalo — web

Páginas públicas de una lista de regalo, para quien recibe el enlace: la lista como catálogo, la ficha de cada producto y la selección de unidades. El carrito, el checkout y la confirmación son los de `tienda_online`; la extensión del servidor liga el carrito a la lista, pone el precio de la lista y deja solo pago y recogida en tienda.

Usa los primitivos, los tokens `--tienda-*` y el layout de `tienda_online`, igual que sus páginas.

API del backend (`olula_servidor`, extensión `tienda_lista_regalos`). Todas las llamadas envían `X-Store-View`.

| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/public/tienda_lista_regalos/lista/<token>` | `{datos: {nombre, descripcion, lineas: [LineaListaPublica]}}`; 404 |
| GET | `/public/tienda_lista_regalos/lista/<token>/linea/<idlinea>` | `{datos: LineaListaPublica + {descripcion_corta, descripcion_larga, meta_titulo, meta_descripcion, imagenes: [{url, alt, principal}]}}`; 404 |
| POST | `/public/tienda_lista_regalos/lista/<token>/carrito/<token_carrito>` | `{}`; 400 carrito de otra lista o con artículos de fuera, 404 lista o carrito inexistente, 409 carrito no modificable |

- `LineaListaPublica`: `{id, referencia, descripcion, imagen: {url, alt} | null, precio, divisa, cantidad, vendida, pendiente}`.

## Ficheros afectados

- `tienda_lista_regalos/web/`: `diseño.ts`, `dominio.ts`, `infraestructura.ts`, `anadir.ts`, `lista/`, `ficha/`, `test/`.
- `tienda_lista_regalos/router_tienda.ts`.

## Specs

### Rutas

<!-- [lista_regalos-web-rutas-01] [x] -->
`RouterFactoryTiendaListaRegalosWeb` tiene las rutas `lista/:token` (`ListaRegalosTienda`) y `lista/:token/producto/:idlinea` (`FichaLineaListaRegalos`). Una app de tienda las añade a su router junto a las de `tienda_online`; ninguna las incluye por defecto.

### Página de la lista

<!-- [lista_regalos-web-lista-01] [x] -->
`/lista/:token` carga la lista y muestra el nombre como título, la descripción y la rejilla de productos en su orden, con la misma rejilla que el catálogo.
- [CARGANDO] lista cargada → LISTO
- [CARGANDO] error 404 → NO_ENCONTRADA («Esta lista no existe o ya no está disponible»)
- [CARGANDO] otro error → ERROR (mensaje genérico con «Reintentar»)

<!-- [lista_regalos-web-lista-02] [x] -->
Cada tarjeta muestra la imagen principal, la descripción, el precio con IVA y «Quedan <pendiente> de <cantidad>», y enlaza a la ficha de la línea. Con pendiente 0 se ve atenuada, con el distintivo «Regalado» y sin botón de añadir.

<!-- [lista_regalos-web-lista-03] [x] -->
Las tarjetas con pendiente llevan el botón rápido de carrito, que añade una unidad (`lista_regalos-web-anadir-01`).

### Ficha

<!-- [lista_regalos-web-ficha-01] [x] -->
`/lista/:token/producto/:idlinea` muestra la galería, la descripción, la descripción corta y la larga, el precio con IVA y «Quedan <pendiente> de <cantidad>», con la miga «<nombre de la lista> › <producto>» que vuelve a la lista. Fija el título y la descripción de la página como la ficha de producto. Mismos estados de carga que la lista; el 404 dice «Este producto no está en la lista».

<!-- [lista_regalos-web-ficha-02] [x] -->
El selector de cantidad va de 1 a lo pendiente. «Añadir al carrito» añade esa cantidad (`lista_regalos-web-anadir-01`). Con pendiente 0 no hay selector ni botón, solo el distintivo «Regalado».

### Añadir al carrito

<!-- [lista_regalos-web-anadir-01] [x] -->
`anadirLineaDeLista(token, referencia, cantidad)` asegura el carrito, lo liga a la lista (POST de ligar) y añade la línea con el POST de línea de `tienda_online`. Si el carrito ya no existe o no es modificable (404 o 409), lo olvida y repite los tres pasos una vez. Al terminar recarga el carrito y muestra el aviso «<producto> añadido al carrito».

<!-- [lista_regalos-web-anadir-02] [x] -->
Si ligar responde 400 porque el carrito tiene productos de otra lista o de fuera, no añade nada y abre un diálogo: «Tu carrito tiene productos de otra lista. ¿Quieres empezar un carrito nuevo para esta lista?», con «Empezar carrito nuevo» y «Cancelar». Con «Empezar carrito nuevo», olvida el carrito actual en el navegador y repite el añadido; con «Cancelar» no hace nada.

<!-- [lista_regalos-web-anadir-03] [x] -->
Los demás errores de añadir se muestran con el aviso de error de la tienda, con el texto del servidor si lo trae.
