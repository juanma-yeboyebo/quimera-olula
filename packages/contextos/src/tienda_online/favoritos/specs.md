# Tienda online — favoritos

Corazón en tarjeta y ficha, lista de favoritos del comprador y página «Mis favoritos». Solo con sesión.

API del backend (`olula_servidor`, app `tienda_online`). Todas las llamadas envían `X-Store-View` y requieren login.

| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/tienda_online/favoritos` | `{datos: [referencia]}`; 404 sin cuenta |
| GET | `/tienda_online/favoritos/articulos?q=…` | `{datos: ProductoCatalogo[], total}` |
| POST | `/tienda_online/favoritos/<referencia>` | `{}`; 404 artículo no publicado o sin cuenta |
| DELETE | `/tienda_online/favoritos/<referencia>` | `{}` |

## Almacén

<!-- [favoritos-store-01] [nueva] -->
`favoritos_store` (useSyncExternalStore) guarda las referencias favoritas. Se cargan una sola vez al iniciar sesión o al cargar la tienda con sesión; las tarjetas y la ficha consultan el almacén sin llamar al servidor.

<!-- [favoritos-store-02] [nueva] -->
Al cerrar sesión el almacén se vacía. Sin sesión no se llama a la API.

<!-- [favoritos-store-03] [nueva] -->
Marcar o desmarcar actualiza el almacén al instante y después llama a POST o DELETE; si la llamada falla, se deshace el cambio y se muestra un aviso de error.

## Corazón

<!-- [favoritos-corazon-01] [nueva] -->
El corazón se inyecta por los huecos `tarjeta_producto_acciones` y `ficha_acciones` de `FactoryTiendaOnline`, relleno si la referencia es favorita y vacío si no. Botón con `aria-pressed` y `aria-label` «Añadir X a favoritos» / «Quitar X de favoritos».

<!-- [favoritos-corazon-02] [nueva] -->
Sin sesión, pulsar el corazón lleva a «Entrar» y, al volver con sesión, la referencia queda marcada.

<!-- [favoritos-corazon-03] [nueva] -->
Al marcar se muestra el aviso «X añadido a favoritos» con la acción «Ver favoritos»; al desmarcar, «X quitado de favoritos».

## Mis favoritos

<!-- [favoritos-pagina-01] [nueva] -->
Ruta `/mi-cuenta/favoritos` (con sesión), enlazada desde «Mi cuenta». Muestra los artículos con la tarjeta del catálogo, en la misma rejilla, con «Ver más» como el catálogo.

<!-- [favoritos-pagina-02] [nueva] -->
Al desmarcar un artículo en la página desaparece de la lista sin recargar.

<!-- [favoritos-pagina-03] [nueva] -->
Sin favoritos: «Aún no tienes favoritos» con enlace al catálogo.
