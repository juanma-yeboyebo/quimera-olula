# Tienda online — común

Base compartida por los módulos de la tienda (catálogo, producto, carrito, checkout y cuenta): storeview activo, cliente REST de la API pública, almacén del token del carrito e icono del carrito en la cabecera.

API del backend (`olula_servidor`, app `tienda_online`). Las rutas `/public/...` no exigen login. Todas las llamadas de la tienda envían la cabecera `X-Store-View: <codigo>`.

| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/public/tienda_online/storeview/<codigo>` | `{datos: {codigo, nombre, idioma, url_base, website: {id, codigo, nombre, divisa}}}`; 404 si no existe |
| POST | `/public/tienda_online/carrito` | `{token}` |
| GET | `/public/tienda_online/carrito/<token>` | `{datos: {token, estado, divisa, neto, total_iva, total, unidades, datos_checkout, lineas[], documento}}`; 404 si no existe |
| GET | `/tienda_online/carrito` (con login) | carrito abierto del usuario en el storeview |

Estados del carrito: `ABIERTO`, `PAGO_PENDIENTE`, `PAGADO`, `CONVERTIDO`, `ERROR_CONVERSION`.

## Specs

### Storeview

<!-- [tienda-storeview-01] [x] -->
El código del storeview activo sale de la variable de entorno de la app `VITE_STORE_VIEW`. Si no está definida, la tienda muestra un error de configuración en lugar del catálogo.

<!-- [tienda-storeview-02] [x] -->
Al arrancar, la tienda carga el storeview (`GET /public/tienda_online/storeview/<codigo>`) y lo mapea a `StoreView { codigo, nombre, idioma, urlBase, website: { id, codigo, nombre, divisa } }`.

<!-- [tienda-storeview-03] [x] -->
Si el storeview no existe (404), la tienda muestra «Tienda no disponible» y no intenta crear carrito.

<!-- [tienda-storeview-04] [x] -->
Todas las llamadas REST de la tienda añaden la cabecera `X-Store-View` con el código del storeview activo. Las llamadas de catálogo y ficha añaden además `X-Carrito-Token` cuando hay un token guardado (así el backend aplica el precio del cliente asociado al carrito).

### Almacén del carrito

<!-- [tienda-carrito_store-01] [x] -->
El token del carrito se guarda en `localStorage` con una clave por storeview (`tienda_online.carrito.<codigo_storeview>`), de modo que dos tiendas en el mismo navegador no comparten carrito.

<!-- [tienda-carrito_store-02] [x] -->
Al arrancar sin token guardado no se crea carrito: el contador es 0. El carrito se crea (`POST /public/tienda_online/carrito`) la primera vez que se añade un artículo, y el token devuelto se guarda.

<!-- [tienda-carrito_store-03] [x] -->
Al arrancar con token guardado se carga el carrito (`GET /public/tienda_online/carrito/<token>`) y el contador muestra el número de unidades (`unidades`) del carrito.

<!-- [tienda-carrito_store-04] [x] -->
Si el carrito del token guardado no existe (404) o ya no está en un estado modificable (`PAGADO`, `CONVERTIDO` o `ERROR_CONVERSION`), el token se descarta y el contador vuelve a 0. Un carrito en `PAGO_PENDIENTE` se conserva.

<!-- [tienda-carrito_store-05] [x] -->
El almacén expone el carrito actual a React mediante `useSyncExternalStore` (hook `useCarritoTienda`), y una función `recargarCarrito()` que vuelve a leerlo del servidor. Cualquier cambio en las líneas (de otros módulos) llama a `recargarCarrito()` y el contador se actualiza sin recargar la página.

<!-- [tienda-carrito_store-06] [x] -->
`olvidarCarrito()` borra el token guardado y deja el contador a 0 (se usará tras un pago confirmado).

### Icono del carrito en la cabecera

<!-- [tienda-icono_carrito-01] [cambiada] -->
`AccionesCabeceraTienda` es el componente base del hueco `cabecera_acciones` de la `CabeceraTienda` (ver `tienda-cabecera-02`). Incluye el carrito, que abre el cajón del carrito (ver `carrito-cajon-01`) y se muestra también sin login.
<!-- antes: la app lo inyectaba en `Componentes.cabecera_acciones` de la cabecera del ERP; el carrito enlazaba a `/carrito` -->

<!-- [tienda-icono_carrito-02] [x] -->
El icono muestra un distintivo con el número de unidades del carrito cuando es mayor que 0, y no lo muestra con 0. Tiene `aria-label` «Carrito, N artículos».

<!-- [tienda-icono_carrito-03] [x] -->
Junto al icono aparece «Entrar» (enlace a `/login`) sin sesión, o «Mi cuenta» (enlace a `/mi-cuenta`) con sesión.

### App `tienda_online`

<!-- [tienda-app-01] [cambiada] -->
Existe la app `apps/tienda_online` (paquete `@olula/tienda_online`), basada en `apps/jornadas`, con su factory (`TiendaOnline`, `Auth` con `rutas_publicas`), router y `.env` de ejemplo con `VITE_API_URL` y `VITE_STORE_VIEW`. La factory de la app no registra nada en `Componentes` porque la tienda no usa la cabecera del ERP.
<!-- antes: la factory registraba `Componentes.cabecera_logo` y `Componentes.cabecera_acciones` para la cabecera del ERP -->

<!-- [tienda-app-04] [nueva] -->
La ruta raíz de la app usa `LayoutTienda` como componente, en lugar de `Vista` (ver `tienda-layout-01`).

<!-- [tienda-app-02] [x] -->
Las rutas públicas de la app son `/`, `/catalogo`, `/categoria`, `/producto`, `/carrito`, `/checkout` y `/registro`: se navega por ellas sin login. `/mi-cuenta` exige login.

<!-- [tienda-app-03] [cambiada] -->
La ruta `/` muestra la página de inicio (ver `inicio-ruta-01`). Si el storeview no está configurado o no existe, en su lugar se muestra el error de configuración o «Tienda no disponible».
<!-- antes: la ruta `/` mostraba el catálogo -->

### Identidad visual

<!-- [tienda-identidad-01] [nueva] -->
`comun/tema/capas.css` declara el orden de capas de cascada de la tienda: `@layer erp, tienda.tokens, tienda.primitivos, tienda.componentes, tienda.paginas, cliente;`. Es lo primero que importa el `index.css` de la app.

<!-- [tienda-identidad-02] [nueva] -->
El `index.css` de la app importa el CSS del ERP (`@olula/componentes/tema/tema.css`) dentro de la capa `erp`, con `@import "…" layer(erp)`. Así sus estilos globales de `html`, `body`, títulos y formularios no pisan las capas de la tienda.

<!-- [tienda-identidad-03] [nueva] -->
`comun/tema/tokens.css`, dentro de `@layer tienda.tokens`, define en `:root`:
- la paleta: `--tienda-neutro-{0,50,100,300,500,700,900}`, `--tienda-marca-{500,600}`, `--tienda-realce-500` y `--tienda-exito-500`;
- la tipografía: `--tienda-fuente-texto`, `--tienda-fuente-titulos`, `--tienda-peso-titulos` y `--tienda-tracking-titulos`;
- la escala de texto: `--tienda-texto-{xs,sm,md,lg,xl,xxl}`;
- los espacios: `--tienda-espacio-{1,2,3,4,6,8}`, `--tienda-espacio-seccion` y `--tienda-ancho-max`;
- los radios: `--tienda-radio-{control,tarjeta,boton,distintivo}`;
- las sombras: `--tienda-sombra-{elevada,cajon}`;
- la proporción de las fotos: `--tienda-ratio-foto`.

Los valores son los de la identidad base neutra de la maqueta: Instrument Sans e Instrument Serif, neutros cálidos, acento casi negro, radios pequeños y fotos 4:5.

<!-- [tienda-identidad-04] [nueva] -->
`tokens.css` define también los tokens semánticos `--tienda-color-*`, que apuntan a la paleta: `fondo`, `superficie`, `superficie-hundida`, `texto`, `texto-suave`, `borde`, `borde-fuerte`, `accion`, `accion-hover`, `accion-texto`, `precio`, `oferta`, `exito`, `error`, `aviso-fondo`, `aviso-texto`, `distintivo-fondo` y `distintivo-texto`.

Los componentes y las páginas de la tienda solo leen los semánticos y los de escala (texto, espacio, radio, sombra, ratio). Nunca leen la paleta directamente ni los tokens del ERP (`--color-*`, `--espaciado-*`, `--tamaño-*`, `--redondeo-*`).

<!-- [tienda-identidad-05] [nueva] -->
Cada app de tienda puede tener un `src/identidad.css`, que se importa lo último en su `index.css` y deja todas sus reglas dentro de `@layer cliente`.
- Si sobrescribe un token en `:root`, cambia toda la tienda.
- También puede añadir reglas para componentes concretos.

La app base `tienda_online` no tiene `identidad.css`.

<!-- [tienda-identidad-06] [nueva] -->
Las fuentes de la identidad base se cargan desde el `index.html` de la app. Cada app cliente carga las suyas.

<!-- [tienda-identidad-07] [nueva] -->
Cada CSS nuevo de la tienda mete sus reglas en su capa:
- `tienda.primitivos`: los primitivos;
- `tienda.componentes`: los compuestos (cabecera, pie, tarjeta, cajones);
- `tienda.paginas`: los estilos propios de cada pantalla.

### Primitivos

Componentes propios de la tienda en `comun/componentes/`. No usan `QBoton` ni `QInput`. Los iconos son los de `QIcono`.

<!-- [tienda-primitivos-01] [nueva] -->
`BotonTienda`:
- **Variantes:** `principal` (la de por defecto), `secundario` y `enlace`, más la opción `ancho` para ocupar todo el ancho.
- **Como enlace:** con la prop `a` pinta un `Link` de react-router con el mismo aspecto.
- **Deshabilitado:** se ve atenuado, con el cursor de no permitido, y no dispara `onClick`.
- **Tamaño:** altura mínima de 44 px.

<!-- [tienda-primitivos-02] [nueva] -->
`BotonIcono` es un botón redondo de 40 px:
- **Props:** `icono` (nombre de `QIcono`), `etiqueta` (obligatoria, va al `aria-label`) y `contador` opcional. Con la prop `a` es un `Link`.
- **Contador:** el texto lo calcula `textoContador(n)` en `comun/dominio.ts`: `null` con 0 o menos (no se pinta), el número de 1 a 99 y «99+» por encima de 99.

<!-- [tienda-primitivos-04] [nueva] -->
`CampoFormulario` usa los tokens de la tienda:
- etiqueta encima;
- campo con el radio de control y borde fuerte;
- al enfocar, el borde y un anillo con el color de acción;
- con error, el borde y el mensaje en el color de error.

Sus props y su comportamiento no cambian.

<!-- [tienda-primitivos-05] [nueva] -->
`PrecioTienda` recibe `importe` y `divisa`, y lo formatea con `formatearPrecio` en el idioma del storeview activo. Tiene la variante `grande` para la ficha. Se pinta con `--tienda-color-precio` y cifras tabulares.

<!-- [tienda-primitivos-06] [nueva] -->
`DistintivoTienda` es una etiqueta corta en versalitas y con forma de píldora. Variantes:
- `neutro`, por ejemplo «Destacado»;
- `oferta`, con el color de oferta;
- `agotado`, con el texto suave.

<!-- [tienda-primitivos-07] [nueva] -->
`SelectorCantidad` muestra `−`, un campo numérico editable con el valor y `+`.
- Recibe `valor`, `minimo` (1 por defecto), `maximo` opcional, `deshabilitado` y `onCambiar`.
- El nuevo valor lo calcula `limitarCantidad(valor, minimo, maximo)` en `comun/dominio.ts`, sin salirse de los límites.
- Cada botón se deshabilita al llegar a su límite.
- El campo envía el cambio al perder el foco o con Intro. Una función pura `cantidadValida(valor)` en `comun/dominio.ts` acepta solo números mayores que 0; si lo escrito no es válido, el campo vuelve a `valor` sin llamar a `onCambiar`. Si es válido, se ajusta con `limitarCantidad` y solo se llama a `onCambiar` si cambia. El campo tiene la etiqueta accesible «Cantidad».
- Etiquetas de los botones: «Restar uno» y «Sumar uno».

<!-- [tienda-primitivos-08] [nueva] -->
`ImagenProducto` recibe `imagen: {url, alt} | null` y la opción `prioritaria`.
- **Contenedor:** con `aspect-ratio: var(--tienda-ratio-foto)` y fondo `superficie-hundida`.
- **Foto:** con `object-fit: cover` y `loading="lazy"`, salvo si es prioritaria.
- **Sin foto:** si no hay imagen o falla la carga (`onError`), muestra `SinImagen`.

<!-- [tienda-primitivos-09] [nueva] -->
Solo en desarrollo (`import.meta.env.DEV`) existe la ruta `/estilos`, con muestras de los tokens activos y de todos los primitivos, para revisar una identidad nueva. En producción no se registra.

### Layout

<!-- [tienda-layout-01] [nueva] -->
`comun/layout/LayoutTienda.tsx` pinta, por este orden, el aviso, la `CabeceraTienda`, un `<main>` con el `Outlet` de la ruta y el pie. No usa `Vista`, `Plantilla` ni la cabecera o el menú lateral del ERP.

<!-- [tienda-layout-02] [nueva] -->
`LayoutTienda` proporciona `ContextoError` con `intentar`, igual que `Vista`, para que `useMaquina` funcione en las pantallas. Si `intentar` captura un error, lo muestra en un diálogo propio de la tienda con el título, la descripción y el botón «Cerrar».

<!-- [tienda-layout-03] [nueva] -->
En las rutas que empiezan por `/checkout`, el layout muestra una cabecera mínima: el logo y «Pago seguro» con el icono `candado`. No hay aviso, buscador, acciones, menú de categorías ni pie. Lo decide `esRutaCheckout(pathname)` en `comun/dominio.ts`.

<!-- [tienda-layout-04] [nueva] -->
Si el hueco `layout_aviso` de `FactoryTiendaOnline` tiene componente, se pinta encima de la cabecera una barra con los colores `aviso-fondo` y `aviso-texto`. Por defecto es `null` y no hay barra.

<!-- [tienda-layout-05] [nueva] -->
El pie base (`PieTienda`, hueco `layout_pie`) muestra:
- el nombre del website;
- enlaces a las categorías de primer nivel (6 como máximo);
- enlaces a «Mi cuenta» y «Carrito»;
- «© <año> <nombre del website>».

### Cabecera

<!-- [tienda-cabecera-01] [nueva] -->
`CabeceraTienda` se queda fija arriba al hacer scroll. Tiene una fila con el logo, el buscador y las acciones, y debajo el menú de categorías.

<!-- [tienda-cabecera-02] [nueva] -->
`FactoryTiendaOnline` tiene los huecos `cabecera_logo`, `cabecera_buscador`, `cabecera_acciones`, `menu_categorias`, `layout_aviso` y `layout_pie`, todos `null` por defecto. Con `null` se usa el componente base, y una app cliente puede sustituir cualquiera sin rehacer la cabecera.

<!-- [tienda-cabecera-03] [nueva] -->
El logo base es el nombre del website del storeview activo, con la fuente de títulos, y enlaza a `/`.

<!-- [tienda-cabecera-04] [nueva] -->
El buscador base es un campo de búsqueda con el texto de ayuda «Buscar productos» y la etiqueta accesible «Buscar productos».
- **Al enviar:** navega a la ruta que devuelve `rutaBusqueda(texto)` en `comun/dominio.ts`. Quita los espacios de los extremos; si queda vacío devuelve `/catalogo`, y si no, `/catalogo?texto=<texto codificado>`.
- **En el catálogo:** el campo muestra el `texto` de la URL.

<!-- [tienda-cabecera-05] [nueva] -->
El menú de categorías base enlaza a `/categoria/<slug>` cada categoría de primer nivel del árbol (`getCategorias`), en una sola línea. Marca con `aria-current` la de la ruta actual. Mientras no haya mega menú, las subcategorías no se muestran.

<!-- [tienda-cabecera-06] [nueva] -->
En pantallas de 860 px de ancho o menos:
- la primera fila lleva el botón de menú (icono `menu`, etiqueta «Abrir menú»), el logo y las acciones;
- el buscador pasa a una segunda fila a todo el ancho;
- la barra de categorías se oculta.

Mientras no haya cajón de menú, el botón de menú lleva a `/catalogo`.

### Menú de categorías

<!-- [tienda-menu-01] [nueva] -->
`useCategoriasTienda()` (en `comun/categorias_store.ts`) devuelve el árbol de categorías y solo hace una petición a `getCategorias` por carga de la app. La comparten el menú, el pie y el cajón del móvil. Si la petición falla, devuelve una lista vacía y el menú no se pinta.

<!-- [tienda-menu-02] [nueva] -->
`FactoryTiendaOnline` tiene `menu_max_en_barra = 8` y `menu_en_barra_con_todas = 6`. `repartirMenu(categorias, maxEnBarra, enBarraConTodas)` en `comun/dominio.ts` devuelve `{ conTodas, enBarra }`:
- con `maxEnBarra` categorías de primer nivel o menos, `conTodas` es `false` y van todas a la barra;
- con más, `conTodas` es `true` y a la barra van las `enBarraConTodas` primeras.

<!-- [tienda-menu-03] [nueva] -->
`contenidoMega(categoria)` en `comun/dominio.ts` prepara el panel de una categoría:
- devuelve `columnas` (las hijas que a su vez tienen hijas) y `sueltas` (las que no);
- cada columna lleva como mucho 6 nietas, y `verMas` a `true` si tiene más.

El cuarto nivel y los siguientes nunca aparecen en el panel.

<!-- [tienda-menu-04] [nueva] -->
En escritorio, si una categoría de la barra tiene hijas, al pasar el ratón por ella o al enfocarla con el teclado se abre debajo de la cabecera un panel a todo el ancho:
- arriba, «Ver todo en <categoría>»;
- debajo, cada columna con la hija como título y sus nietas como enlaces, más «Ver más» si hay más de 6;
- las hijas sueltas, como enlaces destacados; si solo hay sueltas, se reparten en varias columnas para no dejar el panel vacío.

El panel se abre con un retardo corto para que no parpadee al cruzar la barra con el ratón. Se cierra al salir de la cabecera, con Escape o al navegar.

<!-- [tienda-menu-05] [nueva] -->
Cuando `conTodas` es `true`, la barra empieza con el botón «Todas las categorías» (icono `menu`, con `aria-expanded`). Al pulsarlo se abre un panel:
- a la izquierda, la lista de todas las categorías de primer nivel, con «›» en las que tienen hijas;
- a la derecha, el contenido de la categoría marcada, igual que en `tienda-menu-04`, que cambia al pasar el ratón o el foco por la lista.

Al principio está marcada la primera. El panel se cierra al pulsar fuera, al salir de la cabecera, con Escape o al navegar. Mientras está abierto, no se abren los paneles de las categorías de la barra.

<!-- [tienda-menu-06] [nueva] -->
En pantallas de 860 px de ancho o menos, el botón de menú de la cabecera abre un cajón lateral izquierdo con un velo detrás. Sustituye al enlace a `/catalogo` de `tienda-cabecera-06`.
- **Primer nivel:** el título «Menú», las categorías de primer nivel y, debajo, «Mi cuenta» (o «Entrar» sin sesión) y «Carrito».
- **Categoría con hijas:** es un botón con «›» que baja un nivel.
- **Categoría sin hijas:** es un enlace a `/categoria/<slug>`.
- **Niveles inferiores:** cada uno muestra «‹ Atrás», el nombre de la categoría, «Ver todo en <categoría>» y sus hijas. Admite cualquier profundidad.

El nivel que se muestra lo calcula `nodoDeRuta(arbol, ruta)` en `comun/dominio.ts`: devuelve la categoría a la que lleva la lista de slugs `ruta`, o `null` si la ruta está vacía o algún slug no existe.

<!-- [tienda-menu-07] [nueva] -->
El cajón del menú se cierra al navegar, con Escape, al pulsar el velo o con el botón «Cerrar menú». Al abrirlo:
- el foco pasa al cajón;
- la página de detrás no hace scroll.

Al cerrarlo, el foco vuelve al botón de menú.

<!-- [tienda-menu-08] [nueva] -->
El hueco `menu_categorias` sustituye a la vez la barra de escritorio y el cajón del móvil. El menú base de `tienda-cabecera-05` pasa a ser el de esta sección.

<!-- [tienda-menu-09] [nueva] -->
Las fotos de las categorías van en la carpeta pública de la app, con el slug como nombre: `<ruta_imagenes_categoria>/<slug>.jpg`. `ruta_imagenes_categoria` está en `FactoryTiendaOnline` y vale `/categorias` por defecto; esa carpeta no se sube al repositorio. Cuando todas las hijas de una categoría son sueltas, el panel las muestra como tarjetas con la foto y el nombre. Si la foto no existe, la tarjeta se queda solo con el nombre.
