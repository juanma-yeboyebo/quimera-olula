# Administración de la tienda — artículos web

| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/tienda_admin/articulo?q=…` | `{datos: [{referencia, descripcion, imagen, publicado, visible, destacado}], total}`; filtros `website_id`, texto, `estado` (`publicado`, `no_publicado`, `todos`), `categoria_id` |
| GET | `/tienda_admin/articulo/<referencia>` | `{datos: {referencia, descripcion, precio, textos: {"*": {nombre, descripcion_corta, descripcion_larga, meta_titulo, meta_descripcion}, "en": {…}}, idiomas: [idioma], publicaciones: [{website_id, publicado, visible, destacado, slug, orden, fecha_publicacion}], imagenes: [{id, url, alt, orden, principal}], categorias: [{id, nombre, ruta}]}}`; 404 |
| PATCH | `/tienda_admin/articulo/<referencia>/publicacion/<website_id>` | body `{publicado, visible, destacado, slug, orden}`; `{}`; 400, 404, 409 slug repetido |
| DELETE | `/tienda_admin/articulo/<referencia>/publicacion/<website_id>` | `{}` |
| PATCH | `/tienda_admin/articulo/<referencia>/textos` | body `{idioma, nombre, descripcion_corta, descripcion_larga, meta_titulo, meta_descripcion}`; `{}`; 400 |
| PATCH | `/tienda_admin/articulo/<referencia>/categorias` | body `{categorias: [id]}`; `{}`; 404 |
| PATCH | `/tienda_admin/articulo/<referencia>/imagen/ordenar` | body `{ids: [id]}`; `{}`; 400, 404 |
| PATCH | `/tienda_admin/articulo/<referencia>/imagen/<id>/principal` | `{}`; 404 |
| POST | `/tienda_admin/articulo/<referencia>/imagen` | multipart `fichero` → `{id}`; 400 tipo o tamaño no válido |
| DELETE | `/tienda_admin/articulo/<referencia>/imagen/<id>` | `{}` |

## Maestro

<!-- [tienda_admin-articulo-maestro-01] [nueva] -->
Listado paginado de artículos del website activo con miniatura, referencia, descripción y distintivos «Publicado» / «No publicado», «Oculto» (publicado pero no visible) y «Destacado».

<!-- [tienda_admin-articulo-maestro-02] [nueva] -->
Filtros: texto (referencia o descripción), estado (Publicados, No publicados, Todos; por defecto Todos) y categoría.

## Detalle

<!-- [tienda_admin-articulo-detalle-01] [nueva] -->
El detalle muestra referencia, descripción y precio del ERP (solo lectura, con enlace al artículo del ERP) y las pestañas «Publicación», «Textos», «Categorías» y «Fotos».

<!-- [tienda_admin-articulo-publicacion-01] [x] -->
<!-- antes: Pestaña «Publicación» del website activo: interruptores Publicado, Visible y Destacado, slug y orden. Guardar llama a PATCH de publicación; si el artículo no está publicado en el website, el botón dice «Publicar en <website>». «Quitar de <website>» (con confirmación) llama a DELETE. Muestra la fecha de publicación si existe. -->
Pestaña «Publicación»: tabla con una fila por website activo, sin depender del website elegido arriba, con website, estado, slug, orden y fecha de publicación. El estado es «Sin publicar» (no tiene publicación en ese website), «En pausa» (no publicado), «Oculto en catálogo» (publicado y no visible) o «Publicado». Cada fila tiene «Publicar», si está sin publicar, o «Editar», que abren el modal de `tienda_admin-articulo-publicacion-03`. La función que da el estado es pura y está en `dominio.ts`.

<!-- [tienda_admin-articulo-publicacion-03] [x] -->
Modal de publicación de un website: casillas «En venta» (el campo `publicado`), «Visible en el catálogo» y «Destacado», slug y orden. Aceptar llama a PATCH de publicación y recarga el detalle y el maestro. Si el artículo ya está publicado en ese website, el modal tiene además «Quitar de <website>», que pide confirmación y llama a DELETE. Al publicar por primera vez, «En venta» y «Visible en el catálogo» vienen marcadas.

<!-- [tienda_admin-articulo-publicacion-02] [nueva] -->
El slug se valida en el cliente con las mismas reglas que el servidor (minúsculas, letras sin acentos, números y guiones, sin guiones en los extremos, máximo 150); si se deja vacío al publicar lo genera el servidor. El 409 del servidor se muestra en el campo slug.

<!-- [tienda_admin-articulo-textos-01] [x] -->
<!-- antes: Pestaña «Textos»: descripción corta (máx. 255), descripción larga (área de texto), título SEO (máx. 255) y descripción SEO (máx. 500), con contador de caracteres. Guardar llama a PATCH de textos. -->
Pestaña «Textos»: selector de idioma con «Por defecto» y los `idiomas` del detalle, y los campos nombre en la tienda (máx. 100), descripción corta (máx. 255), descripción larga (área de texto), título SEO (máx. 255) y descripción SEO (máx. 500), con contador de caracteres. Guardar llama a PATCH de textos con el idioma elegido (`*` para «Por defecto»). Cambiar de idioma con cambios sin guardar pide confirmación.

<!-- [tienda_admin-articulo-textos-02] [x] -->
En «Por defecto», el nombre vacío muestra como sugerencia la descripción del ERP. En otro idioma, cada campo vacío muestra como sugerencia el texto por defecto, y debajo del selector se avisa: «Lo que dejes vacío se mostrará con el texto por defecto».

<!-- [tienda_admin-articulo-categorias-01] [nueva] -->
Pestaña «Categorías»: árbol de categorías del website activo con casillas; marcar o desmarcar y guardar llama a PATCH de categorías con las marcadas en el orden del árbol.

<!-- [tienda_admin-articulo-fotos-01] [x] -->
<!-- antes: Pestaña «Fotos»: rejilla con las imágenes actuales en su orden, la principal señalada. «Subir fotos» y «Borrar» funcionan (`tienda_admin-articulo-fotos-02` y `-03`). Arrastrar para ordenar y «Marcar como principal» siguen deshabilitados con el texto «Disponible próximamente». -->
Pestaña «Fotos»: rejilla con las imágenes actuales en su orden, la principal señalada. Todos los controles funcionan (`tienda_admin-articulo-fotos-02` a `-05`) y desaparece el texto «Disponible próximamente».

<!-- [tienda_admin-articulo-fotos-02] [x] -->
«Subir fotos» abre el selector de ficheros del navegador (varios a la vez, JPEG, PNG o WebP). Los sube de uno en uno con POST multipart, mostrando «Subiendo <n> de <total>» y con el botón deshabilitado mientras dura. Al terminar recarga el detalle y el maestro, para que se vea la miniatura. Si algún fichero da error, sigue con los demás y al final muestra en el diálogo de errores qué ficheros no se subieron y por qué.

<!-- [tienda_admin-articulo-fotos-03] [x] -->
«Borrar» en una foto pide confirmación, llama a DELETE de la imagen y recarga el detalle y el maestro.

<!-- [tienda_admin-articulo-fotos-04] [x] -->
Las fotos se ordenan arrastrando una sobre otra (se coloca delante o detrás según la mitad en que se suelte) o con los botones «←» y «→» de cada foto; el «←» de la primera y el «→» de la última están deshabilitados. Cada movimiento llama a `imagen/ordenar` con todos los ids en el nuevo orden y recarga el detalle. La función que calcula el nuevo orden es pura y está en `dominio.ts`.

<!-- [tienda_admin-articulo-fotos-05] [x] -->
«Marcar como principal» llama a `imagen/<id>/principal` y recarga el detalle y el maestro, porque la miniatura del maestro es la principal. En la foto que ya es principal el botón no aparece.
