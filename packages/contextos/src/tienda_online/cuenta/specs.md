# Tienda online — cuenta

Registro de compradores, login con asociación del carrito, cierre de sesión, mi cuenta, mis pedidos y detalle de pedido.

API del backend (`olula_servidor`, app `tienda_online`). Todas las llamadas envían `X-Store-View`.

| Método | Ruta | Respuesta |
|---|---|---|
| POST | `/public/tienda_online/cuenta/registro` | body `{email, password, nombre, id_fiscal, telefono, direccion: {nombre_via, numero, cod_postal, ciudad, provincia, pais_id}}`; `{id}`; 400 datos no válidos (texto con el motivo), 409 email ya registrado, 404 storeview |
| POST | `/auth/login` | el de auth (`login(id, contraseña)` de `auth/login/dominio.ts`) |
| POST | `/tienda_online/carrito/<token>/asociar` (con login) | `{}`; absorbe los otros carritos abiertos del comprador en el del token; 404, 409 |
| GET | `/tienda_online/carrito` (con login) | `{datos: CarritoPublico}` del carrito abierto del usuario; 404 si no tiene |
| GET | `/tienda_online/cuenta/yo` (con login) | `{datos: {email, nombre, id_fiscal, telefono, cliente_id, direcciones: [{id, nombre_via, numero, cod_postal, ciudad, provincia, pais_id, envio, facturacion}]}}`; 404 sin cuenta en la tienda |
| PATCH | `/tienda_online/cuenta/yo` (con login) | body `{nombre, id_fiscal, telefono}`; `{}`; 400 datos no válidos, 404 sin cuenta |
| POST | `/tienda_online/cuenta/direccion` (con login) | body `{nombre_via, numero, cod_postal, ciudad, provincia, pais_id}`; `{id}`; 400 |
| PATCH | `/tienda_online/cuenta/direccion/<id>` (con login) | mismo body; `{}`; 400, 404 |
| DELETE | `/tienda_online/cuenta/direccion/<id>` (con login) | `{}`; 404, 409 si es la de facturación |
| PATCH | `/tienda_online/cuenta/direccion/<id>/envio` y `…/facturacion` (con login) | `{}`; 404 |
| GET | `/tienda_online/cuenta/pedido?q=…` (con login) | `{datos: [{id, codigo, fecha, total, divisa, servido}], total}` |
| GET | `/tienda_online/cuenta/pedido/<id>` (con login) | `{datos: {id, codigo, fecha, total, divisa, servido, neto, total_iva, lineas: [{referencia, descripcion, cantidad, precio, importe}]}}`; 404 |

La contraseña del registro va en claro; la del login la codifica `login()` de auth.

## Specs

### Rutas

<!-- [cuenta-rutas-01] [x] -->
La app `tienda_online` sustituye las rutas `login` y `logout` de auth por las de la tienda (`LoginTienda`, `LogoutTienda`) con su propio objeto `Auth` en el router de la app, sin tocar `routerAuth`. Añade `registro`, `mi-cuenta` y `mi-cuenta/pedido/:id`.

<!-- [cuenta-rutas-02] [x] -->
`/registro` es pública; `/mi-cuenta` y `/mi-cuenta/pedido/:id` exigen login (el middleware redirige a `/login`).

### Login

<!-- [cuenta-login-01] [x] -->
La página `/login` de la tienda muestra email, contraseña, el botón «Entrar» y el enlace «Crear cuenta» a `/registro`. Al entrar llama a `login(email, contraseña)` de auth y después a `whoAmI()`, guardando `whoAmIStorage` y `permisosGrupo` como el login de auth.

<!-- [cuenta-login-02] [x] -->
Si el login falla se muestra «Email o contraseña incorrectos» y no se toca el carrito.

<!-- [cuenta-login-03] [x] -->
Tras el login, si hay token de carrito en el almacén, se envía `POST /tienda_online/carrito/<token>/asociar` y se llama a `recargarCarrito()`, que ya trae los precios del cliente. El token no cambia.

<!-- [cuenta-login-04] [x] -->
Si `asociar` responde 404 o 409, se llama a `olvidarCarrito()` y se sigue como si no hubiera token (`cuenta-login-05`).

<!-- [cuenta-login-05] [x] -->
Tras el login, si no hay token de carrito, se lee `GET /tienda_online/carrito`; si devuelve carrito, su token pasa a ser el del almacén (`adoptarToken(token)` en `carrito_store`, que lo guarda en `localStorage` y recarga). Con 404 no se hace nada.

<!-- [cuenta-login-06] [x] -->
Un fallo en la asociación o en la lectura del carrito del usuario no impide el login: se navega igualmente.

<!-- [cuenta-login-07] [x] -->
Tras el login (y la asociación) se navega a `/`. Mientras se procesa, el botón está deshabilitado.

### Cerrar sesión

<!-- [cuenta-logout-01] [x] -->
La ruta `/logout` de la tienda llama a `logout()` de auth, después a `olvidarCarrito()` (el carrito asociado al usuario no debe quedar en el navegador) y navega a `/`.

### Registro

<!-- [cuenta-registro-01] [x] -->
La página `/registro` muestra email, contraseña, repetir contraseña, nombre, NIF/CIF, teléfono (opcional) y la dirección (vía, número, código postal, ciudad, provincia y país, con `ES` por defecto), el botón «Crear cuenta» y el enlace «Ya tengo cuenta» a `/login`.

<!-- [cuenta-registro-02] [x] -->
Validación en el cliente con una función pura `erroresRegistro(datos)`: email con formato válido; contraseña de al menos 8 caracteres; las dos contraseñas iguales («Las contraseñas no coinciden»); nombre, NIF/CIF, vía, código postal, ciudad y país obligatorios. Con errores no se envía y cada campo muestra el suyo.

<!-- [cuenta-registro-03] [x] -->
Una función pura `registroAApi(datos)` construye el body en snake_case, sin la repetición de la contraseña y con los opcionales vacíos como `null`.

<!-- [cuenta-registro-04] [x] -->
[EDITANDO] crear → REGISTRANDO → (envía `POST …/cuenta/registro`; con éxito hace el mismo login que `/login`, con su asociación de carrito, y navega a `/mi-cuenta`)

<!-- [cuenta-registro-05] [x] -->
[REGISTRANDO] error 409 → EDITANDO (muestra «Ya existe una cuenta con ese email» con enlace a `/login`)

<!-- [cuenta-registro-06] [x] -->
[REGISTRANDO] error 400 → EDITANDO (muestra el texto del backend); cualquier otro error muestra «No se ha podido crear la cuenta. Inténtalo de nuevo.»

<!-- [cuenta-registro-07] [x] -->
Si el registro va bien pero el login posterior falla, se navega a `/login`.

### Mi cuenta

<!-- [cuenta-mi_cuenta-01] [x] -->
La página `/mi-cuenta` carga `GET /tienda_online/cuenta/yo` y muestra nombre, email, NIF/CIF, teléfono y las direcciones, indicando cuál es de facturación y cuál de envío.

<!-- [cuenta-mi_cuenta-02] [x] -->
Con 404 muestra «Tu usuario no tiene cuenta en esta tienda» y el botón «Cerrar sesión».

<!-- [cuenta-mi_cuenta-03] [x] -->
La página tiene el botón «Cerrar sesión», que navega a `/logout`.

### Editar datos

<!-- [cuenta-editar_datos-01] [x] -->
La tarjeta «Datos» de `/mi-cuenta` tiene un `BotonTienda` `enlace` «Editar» que la cambia por un formulario con nombre, NIF/CIF y teléfono (`CampoFormulario`), con los valores actuales, y los botones «Guardar» (`principal`) y «Cancelar» (`secundario`). El email se muestra como texto, no editable.

<!-- [cuenta-editar_datos-02] [x] -->
Validación en el cliente con una función pura `erroresDatosCuenta(datos)` en `cuenta/dominio.ts`: nombre y NIF/CIF obligatorios, con los mismos textos que el registro. Con errores no se envía y cada campo muestra el suyo.

<!-- [cuenta-editar_datos-03] [x] -->
[LISTA] guardar_datos → GUARDANDO → LISTA (envía `PATCH /tienda_online/cuenta/yo` con `{nombre, id_fiscal, telefono}`, vuelve a cargar la cuenta y cierra el formulario)

<!-- [cuenta-editar_datos-04] [x] -->
[GUARDANDO] error → LISTA (muestra el texto del backend en el formulario, que sigue abierto con lo escrito)

### Cambiar contraseña

<!-- [cuenta-password-01] [x] -->
La tarjeta «Contraseña» de `/mi-cuenta` tiene un `BotonTienda` `secundario` «Cambiar contraseña» que la cambia por un formulario con contraseña actual, nueva y repetición (`CampoFormulario` tipo `password`, autocomplete `current-password` / `new-password`) y «Guardar» / «Cancelar». Validación en el cliente con una función pura `erroresCambioPassword({actual, nueva, repetir})` en `cuenta/dominio.ts`: actual obligatoria, nueva de al menos 8 caracteres (como el registro) y repetición igual a la nueva. Con errores no se envía y cada campo muestra el suyo.

<!-- [cuenta-password-02] [x] -->
[LISTA] guardar_password → GUARDANDO → LISTA (envía `PATCH /tienda_online/cuenta/password` con `{password_actual, password_nueva}` y cierra el formulario)

<!-- [cuenta-password-03] [x] -->
[GUARDANDO] error → LISTA (muestra el texto del backend, p. ej. «La contraseña actual no es correcta», en el formulario, que sigue abierto)

<!-- [cuenta-password-04] [x] -->
Tras guardar con éxito se muestra bajo el título «Contraseña» un aviso `role="status"` «Contraseña cambiada», que desaparece al abrir cualquier formulario.

### Direcciones

<!-- [cuenta-direcciones-01] [x] -->
La tarjeta «Direcciones» tiene un `BotonTienda` `secundario` «Añadir dirección» y, en cada dirección, «Editar», «Usar para envío» (si no lo es), «Usar para facturación» (si no lo es) y «Borrar» (no aparece en la de facturación), como `BotonTienda` `enlace`.

<!-- [cuenta-direcciones-02] [x] -->
«Añadir dirección» y «Editar» abren dentro de la tarjeta un formulario con vía, número, código postal, ciudad, provincia y país (`ES` por defecto al añadir), con «Guardar» y «Cancelar». Solo hay un formulario de dirección abierto a la vez.

<!-- [cuenta-direcciones-03] [x] -->
Validación en el cliente con una función pura `erroresDireccion(direccion)` en `cuenta/dominio.ts`: vía, código postal, ciudad y país obligatorios, con los mismos textos que el registro. `erroresRegistro` la reutiliza para su dirección.

<!-- [cuenta-direcciones-04] [x] -->
[LISTA] guardar_direccion → GUARDANDO → LISTA (sin id envía `POST /tienda_online/cuenta/direccion`; con id, `PATCH …/direccion/<id>`; vuelve a cargar la cuenta y cierra el formulario. Con error muestra el texto del backend y deja el formulario abierto)

<!-- [cuenta-direcciones-05] [x] -->
«Borrar» pide confirmación en la propia dirección («¿Borrar esta dirección?» con «Sí, borrar» y «No»). Al confirmar: [LISTA] borrar_direccion → GUARDANDO → LISTA (envía `DELETE …/direccion/<id>` y vuelve a cargar la cuenta; con error muestra su texto)

<!-- [cuenta-direcciones-06] [x] -->
[LISTA] marcar_envio / marcar_facturacion → GUARDANDO → LISTA (envía `PATCH …/direccion/<id>/envio` o `…/facturacion` y vuelve a cargar la cuenta; con error muestra su texto)

<!-- [cuenta-direcciones-07] [x] -->
Mientras está en `GUARDANDO`, los botones de datos y direcciones están deshabilitados.

### Mis pedidos

<!-- [cuenta-pedidos-01] [x] -->
En `/mi-cuenta` se listan los pedidos (`GET /tienda_online/cuenta/pedido`) ordenados por fecha descendente, de 20 en 20, con código, fecha, total (con `formatearPrecio` y la divisa del pedido) y estado de servido. Cada fila enlaza a `/mi-cuenta/pedido/<id>`.

<!-- [cuenta-pedidos-02] [x] -->
El botón «Ver más» pide la página siguiente y añade los pedidos a la lista; no se muestra cuando ya están todos (`total`).

<!-- [cuenta-pedidos-03] [x] -->
Sin pedidos se muestra «Todavía no has hecho ningún pedido» con un enlace al catálogo.

### Detalle de pedido

<!-- [cuenta-pedido-01] [x] -->
La página `/mi-cuenta/pedido/:id` carga `GET /tienda_online/cuenta/pedido/<id>` y muestra código, fecha, estado de servido, las líneas (referencia, descripción, cantidad, precio e importe) y los totales (neto, IVA y total), con `formatearPrecio`.

<!-- [cuenta-pedido-02] [x] -->
Con 404 muestra «Pedido no encontrado» con enlace a `/mi-cuenta`.

### Diseño

<!-- [cuenta-diseño-01] [x] -->
`/login` y `/registro` muestran el formulario centrado en una tarjeta estrecha, con el título en la fuente de títulos. Los campos usan `CampoFormulario` y el botón de envío es un `BotonTienda` `principal` a lo ancho. Bajo el login, «¿No tienes cuenta? Crear cuenta» enlaza a `/registro`, y bajo el registro, «¿Ya tienes cuenta? Entrar» enlaza a `/login`, si no estaban ya.

<!-- [cuenta-diseño-02] [x] -->
En `/registro`, los datos y la dirección van en `fieldset` sin borde con la leyenda en la fuente de títulos y los campos en dos columnas (una en 480 px o menos).

<!-- [cuenta-diseño-03] [x] -->
`/mi-cuenta` usa el contenedor centrado de las demás páginas. Datos, direcciones y pedidos son tarjetas con su título. La tabla de pedidos tiene cabecera en texto suave, filas separadas por una línea fina e importes alineados a la derecha; en 860 px o menos cada pedido se muestra como una fila apilada. «Ver más», «Reintentar» y «Cerrar sesión» son `BotonTienda` `secundario`.

<!-- [cuenta-diseño-04] [x] -->
`/mi-cuenta/pedido/:id` usa el contenedor centrado, un enlace «Volver a mi cuenta» encima del título, la misma tabla que `/mi-cuenta` y los totales a la derecha con el total destacado. Los importes usan `formatearPrecio` como ahora.

<!-- [cuenta-diseño-05] [x] -->
`CuentaTienda.css` usa solo tokens `--tienda-*` y va en `@layer tienda.paginas`.
