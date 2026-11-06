# Memoria técnica — tienda_online / comun (y auth/rutas_publicas)

## Comandos de tests

```bash
(cd packages/contextos && npx vitest run src/tienda_online/ src/auth/test/)
# OJO: `pnpm run --filter @olula/ctx test -- <ruta> --run` ignora la ruta y lanza la suite entera
pnpm run --filter @olula/tienda_online type-check
pnpm run --filter @olula/olula type-check   # el cambio del middleware afecta a todas las apps
```

## Ficheros clave (a crear o tocar)

| Fichero | Contenido |
|---|---|
| `packages/contextos/src/auth/middlewares.ts` | `authMiddleware`. Hoy `rutasPublicas` es una lista fija comparada con `includes`. Añadir las de `FactoryObj.app.Auth?.rutas_publicas` por prefijo de segmento. Extraer una función pura `esRutaPublica(pathname, extra)` para testearla. |
| `packages/contextos/lib/src/factory_ctx.tsx` | `FactoryObj.app`: la factory de la app activa, accesible fuera de React (ver `ventas/pedido/infraestructura.ts`). |
| `packages/contextos/src/tienda_online/comun/urls.ts` | `TiendaOnline_Urls`: `STOREVIEW`, `CARRITO` (`/public/tienda_online/...`), `CARRITO_USUARIO` (`/tienda_online/carrito`). |
| `packages/contextos/src/tienda_online/comun/diseño.ts` | `StoreView`, `CarritoTienda`, `LineaCarritoTienda`, `EstadoCarrito`. |
| `packages/contextos/src/tienda_online/comun/infraestructura.ts` | `getStoreView`, `postCarrito`, `getCarrito` y mappers `xxxDesdeApi`. Cabecera `X-Store-View` (y `X-Carrito-Token` en catálogo y ficha). Comprobar si `RestAPI` admite cabeceras extra; si no, añadirlo sin romper la firma actual. |
| `packages/contextos/src/tienda_online/comun/carrito_store.ts` | Almacén con `useSyncExternalStore`, como `packages/contextos/lib/src/carritoLineas.ts`. Clave de `localStorage` por storeview. |
| `packages/contextos/src/tienda_online/comun/componentes/` | `IconoCarrito` / `AccionesCabeceraTienda`. Referencia: `apps/monterelax_area_clientes/src/componentes/AccionesCabeceraMonterelax.tsx` (pero visible sin login). |
| `packages/componentes/src/plantilla/Cabecera.tsx:177` | Slot `cabecera_acciones`; no hace falta tocarlo. |
| `apps/tienda_online/` | Copia de `apps/jornadas` (package.json, vite, tsconfig, index.html, eslint, main.tsx con `authMiddleware`). |

## Patrones específicos

- Los tests van en `packages/contextos/src/tienda_online/comun/test/`. Lógica pura (mappers, `esRutaPublica`, reglas de descarte del token) separada de los efectos para poder testearla sin red; las llamadas REST se mockean.
- El backend devuelve importes como `float` y los ids de línea como `int`.
- Estados en los que se descarta el token: `PAGADO`, `CONVERTIDO`, `ERROR_CONVERSION`.

## Mapeo de specs a tests

| ID spec | Fichero de test | Función/describe |
|---|---|---|
| auth-rutas_publicas-01..03 | `packages/contextos/src/auth/test/middlewares.test.ts` | `esRutaPublica` |
| auth-rutas_publicas-04, 05 | `packages/contextos/src/auth/test/middlewares.test.ts` | `crearAuthMiddleware` |
| tienda-storeview-01 | `packages/contextos/src/tienda_online/comun/test/dominio.test.ts` | `codigoStoreViewDesdeEnv` |
| tienda-storeview-02 | `packages/contextos/src/tienda_online/comun/test/infraestructura.test.ts` | `getStoreView` |
| tienda-storeview-04 | `packages/contextos/src/tienda_online/comun/test/infraestructura.test.ts` | `cabecerasTienda` |
| tienda-carrito_store-01 | `dominio.test.ts` (`claveCarrito`), `carrito_store.test.ts` | clave por storeview |
| tienda-carrito_store-02, 03, 04, 05, 06 | `packages/contextos/src/tienda_online/comun/test/carrito_store.test.ts` | `iniciarCarrito`, `asegurarCarrito`, `recargarCarrito`, `suscribir`, `olvidarCarrito` |
| tienda-carrito_store-03 (mapper) | `infraestructura.test.ts` | `getCarrito` |
| tienda-carrito_store-04 | `dominio.test.ts` | `debeDescartarToken` |
| tienda-icono_carrito-02 | `dominio.test.ts` | `textoAriaCarrito` |
| tienda-storeview-03, tienda-icono_carrito-01/03, tienda-app-* | sin test (estructurales / UI) | - |

## Decisiones verificadas en el código (2026-11-06)

- `FactoryObj.app` se rellena en un `useEffect` de `main.tsx` y `FactoryProvider` lo pisa con `{}` en el primer render. `createBrowserRouter` lanza la navegación inicial (y el middleware) antes de eso, así que el middleware **no** puede leer `FactoryObj.app.Auth.rutas_publicas` de forma fiable. Solución: `esRutaPublica(pathname, extra)` pura + `crearAuthMiddleware(rutasExtra: string[])`; `authMiddleware = crearAuthMiddleware([])` se mantiene para el resto de apps. La app tienda pasa `FactoryAuthTienda.rutas_publicas` en su `main.tsx`.
- En middleware de react-router v7, no llamar a `next()` equivale a llamarlo; en ruta pública se hace `return await next()` explícito.
- `RestAPI.get/post/patch/delete` ya aceptan cabeceras extra como último parámetro (`packages/contextos/lib/src/api/rest_api.ts:139-147`). No hay que tocar `RestAPI`.
- Los errores de `RestAPI` se rechazan como `{ nombre, descripcion, estado }`; el 404 se detecta con `estado === 404`.
- `RestAPI.post` está tipado como `{ id: string }`; para `POST /public/tienda_online/carrito` (que devuelve `{ token }`) hay que castear la respuesta.
- Respuestas del backend comprobadas en `olula_servidor/consultas/tienda_online/{website,carrito}/diseño.py`: `StoreViewPublico {codigo, nombre, idioma, url_base, website {id:int, codigo, nombre, divisa}}`; `CarritoPublico {token, estado, divisa, neto, total_iva, total, unidades, datos_checkout, lineas[], documento}`; `LineaCarritoPublica {id:int, referencia, slug, descripcion, imagen {url, alt}|null, cantidad, precio, dto_porcentual, tipo_iva, iva_incluido, importe}`.
- Ejemplo de test con `RestAPI` mockeado: `packages/contextos/src/ventas/albaran/test/crear_albaran.test.ts` (`vi.mock("@olula/lib/api/rest_api.ts")` + `await import(...)`).
- Sesión: `estaAutentificado()` en `@olula/componentes/plantilla/autenticacion.ts`. Icono `carrito` ya existe en `qicono.tsx`.
- `Cabecera` oculta la cabecera en rutas `/login`, `/forgot-password`, `/signup`… (no afecta a la tienda).

- Trampa de Vitest: `beforeEach(() => mock.mockReset())` devuelve el mock y Vitest lo ejecuta como teardown tras cada test; con `mockRejectedValue` el test falla. Usar siempre llaves: `beforeEach(() => { mock.mockReset(); })`.
- Fase 7 cerrada el 2026-11-06: 50 tests en verde, type-check de `@olula/tienda_online`, `@olula/olula` y `@olula/ctx` y eslint de los ficheros nuevos sin errores.
