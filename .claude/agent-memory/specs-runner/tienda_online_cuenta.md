# Memoria técnica — tienda_online / cuenta

Comando de test: `(cd packages/contextos && npx vitest run src/tienda_online/cuenta)` (y `src/tienda_online/comun` por `adoptarToken`).
Trampa Vitest: `beforeEach(() => { mock.mockReset(); })` siempre con llaves.
Implementado sin ejecutar nada (norma del usuario): tests, type-check y eslint pendientes de verificar.

## Ficheros clave (`packages/contextos/src/tienda_online/cuenta/`)

- `diseño.ts`, `dominio.ts` (puro: `erroresRegistro`, `registroAApi`, `criteriaPedidos`, `añadirPedidos`, `textoDireccion`), `infraestructura.ts` (REST + mappers; cabeceras con `cabecerasTienda(codigoStoreViewActivo())`).
- `sesion.ts`: `iniciarSesion(email, pass): boolean`, `enlazarCarritoTrasLogin()`, `cerrarSesion()`. Reutilizada por login y registro.
- `login/LoginTienda.tsx`, `logout/LogoutTienda.tsx`, `crear/{diseño,crear,maquina}.ts` + `CrearCuenta.tsx`, `detalle/{diseño,detalle,maquina}.ts` + `MiCuenta.tsx`, `pedido/{diseño,pedido,maquina}.ts` + `DetallePedido.tsx`, `CuentaTienda.css` (compartido, reutiliza `CampoFormulario` de checkout).
- `comun/carrito_store.ts`: `adoptarToken(token)`.
- `apps/tienda_online/src/router_factory.ts`: `RouterFactoryAuthTienda` con `...routerAuth` + login/logout/registro/mi-cuenta/mi-cuenta/pedido/:id.

## Mapeo spec -> test

| Spec | Fichero |
|---|---|
| registro-01, 02, 03, pedidos-01 (criteria), pedidos-02 (añadirPedidos) | test/dominio.test.ts |
| registro-04 (ruta), login-03 (asociar), login-05 (GET carrito), mi_cuenta-01, pedidos-01, pedido-01 (rutas/mappers) | test/infraestructura.test.ts |
| login-01..06, logout-01 | test/sesion.test.ts |
| login-05 (adoptarToken) | comun/test/carrito_store.test.ts |
| registro-02, 04..07 | test/crear.test.ts |
| mi_cuenta-01, 02, pedidos-01, 02 | test/detalle.test.ts |
| pedido-01, 02 | test/pedido.test.ts |
| rutas-*, login-07, mi_cuenta-03, pedidos-03, registro-01 (vista) | sin test (estructurales / UI) |
