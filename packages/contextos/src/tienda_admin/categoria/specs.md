# Administración de la tienda — categorías

| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/tienda_admin/categoria?website_id=<id>` | árbol completo: nodos `{id, padre_id, codigo, nombre, slug, orden, visible, en_menu, articulos, hijas}` |
| POST | `/tienda_admin/categoria` | body `{website_id, padre_id, codigo, nombre, slug, visible, en_menu}`; `{id}`; 400, 404, 409 |
| PATCH | `/tienda_admin/categoria/<id>` | body `{nombre, slug, visible, en_menu}`; `{}`; 400, 404, 409 |
| PATCH | `/tienda_admin/categoria/<id>/mover` | body `{padre_id}`; `{}`; 400 |
| PATCH | `/tienda_admin/categoria/ordenar` | body `{website_id, padre_id, ids}`; `{}`; 400 |
| DELETE | `/tienda_admin/categoria/<id>` | `{}`; 409 con hijas o artículos |

## Árbol

<!-- [tienda_admin-categoria-arbol-01] [nueva] -->
La pantalla muestra a la izquierda el árbol del website activo (plegable) y a la derecha el detalle de la categoría seleccionada. Cada nodo indica el número de artículos y lleva distintivos «Oculta» (no visible) y «Fuera del menú» (`en_menu` falso).

<!-- [tienda_admin-categoria-arbol-02] [nueva] -->
Arrastrar un nodo entre hermanas lo reordena (PATCH ordenar con el nuevo orden de las hermanas); soltarlo sobre otro nodo lo mueve dentro (PATCH mover). Además de arrastrar, cada nodo tiene botones «Subir», «Bajar» y «Mover a…» (selector de padre) para usarlo con teclado.

<!-- [tienda_admin-categoria-arbol-03] [nueva] -->
Tras cualquier cambio se recarga el árbol; si el servidor responde error se muestra y el árbol vuelve a su estado anterior.

## Detalle y alta

<!-- [tienda_admin-categoria-detalle-01] [nueva] -->
El detalle edita nombre, slug, «Visible en la tienda» y «Mostrar en el menú» (deshabilitado si no es visible) y muestra código y número de artículos. Guardar llama a PATCH.

<!-- [tienda_admin-categoria-crear-01] [nueva] -->
«Nueva categoría» (arriba) crea una de primer nivel; «Añadir subcategoría» en el detalle crea una hija de la seleccionada. El formulario pide código y nombre; slug opcional (lo genera el servidor). El 409 se muestra en el campo que corresponda.

<!-- [tienda_admin-categoria-borrar-01] [nueva] -->
«Borrar» pide confirmación; si tiene hijas o artículos el botón está deshabilitado con el motivo, y el 409 del servidor se muestra igualmente.
