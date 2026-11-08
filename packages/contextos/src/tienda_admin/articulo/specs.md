# Administración de la tienda — artículos web

| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/tienda_admin/articulo?q=…` | `{datos: [{referencia, descripcion, imagen, publicado, visible, destacado}], total}`; filtros `website_id`, texto, `estado` (`publicado`, `no_publicado`, `todos`), `categoria_id` |
| GET | `/tienda_admin/articulo/<referencia>` | `{datos: {referencia, descripcion, precio, descripcion_corta, descripcion_larga, meta_titulo, meta_descripcion, publicaciones: [{website_id, publicado, visible, destacado, slug, orden, fecha_publicacion}], imagenes: [{id, url, alt, orden, principal}], categorias: [{id, nombre, ruta}]}}`; 404 |
| PATCH | `/tienda_admin/articulo/<referencia>/publicacion/<website_id>` | body `{publicado, visible, destacado, slug, orden}`; `{}`; 400, 404, 409 slug repetido |
| DELETE | `/tienda_admin/articulo/<referencia>/publicacion/<website_id>` | `{}` |
| PATCH | `/tienda_admin/articulo/<referencia>/textos` | body `{descripcion_corta, descripcion_larga, meta_titulo, meta_descripcion}`; `{}`; 400 |
| PATCH | `/tienda_admin/articulo/<referencia>/categorias` | body `{categorias: [id]}`; `{}`; 404 |

## Maestro

<!-- [tienda_admin-articulo-maestro-01] [nueva] -->
Listado paginado de artículos del website activo con miniatura, referencia, descripción y distintivos «Publicado» / «No publicado», «Oculto» (publicado pero no visible) y «Destacado».

<!-- [tienda_admin-articulo-maestro-02] [nueva] -->
Filtros: texto (referencia o descripción), estado (Publicados, No publicados, Todos; por defecto Todos) y categoría.

## Detalle

<!-- [tienda_admin-articulo-detalle-01] [nueva] -->
El detalle muestra referencia, descripción y precio del ERP (solo lectura, con enlace al artículo del ERP) y las pestañas «Publicación», «Textos», «Categorías» y «Fotos».

<!-- [tienda_admin-articulo-publicacion-01] [nueva] -->
Pestaña «Publicación» del website activo: interruptores Publicado, Visible y Destacado, slug y orden. Guardar llama a PATCH de publicación; si el artículo no está publicado en el website, el botón dice «Publicar en <website>». «Quitar de <website>» (con confirmación) llama a DELETE. Muestra la fecha de publicación si existe.

<!-- [tienda_admin-articulo-publicacion-02] [nueva] -->
El slug se valida en el cliente con las mismas reglas que el servidor (minúsculas, letras sin acentos, números y guiones, sin guiones en los extremos, máximo 150); si se deja vacío al publicar lo genera el servidor. El 409 del servidor se muestra en el campo slug.

<!-- [tienda_admin-articulo-textos-01] [nueva] -->
Pestaña «Textos»: descripción corta (máx. 255), descripción larga (área de texto), título SEO (máx. 255) y descripción SEO (máx. 500), con contador de caracteres. Guardar llama a PATCH de textos.

<!-- [tienda_admin-articulo-categorias-01] [nueva] -->
Pestaña «Categorías»: árbol de categorías del website activo con casillas; marcar o desmarcar y guardar llama a PATCH de categorías con las marcadas en el orden del árbol.

<!-- [tienda_admin-articulo-fotos-01] [nueva] -->
Pestaña «Fotos»: rejilla con las imágenes actuales en su orden, la principal señalada. Los controles «Subir fotos», arrastrar para ordenar, «Marcar como principal» y «Borrar» aparecen deshabilitados con el texto «Disponible próximamente»; no llaman al servidor.
