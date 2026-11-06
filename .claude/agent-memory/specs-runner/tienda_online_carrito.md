# Memoria técnica — tienda_online / carrito

Tests en `packages/contextos/src/tienda_online/carrito/test/` (lanzar con `(cd packages/contextos && npx vitest run src/tienda_online/carrito/)`).

## Ficheros a crear

- `carrito/dominio.ts`: `cantidadValida(valor: unknown): boolean`, `estaVacio(c: CarritoTienda | null): boolean`, `hayPagoIniciado(c: CarritoTienda | null): boolean`.
- `carrito/infraestructura.ts`: `patchLineaCarrito(token, lineaId, cantidad): Promise<void>`, `deleteLineaCarrito(token, lineaId): Promise<void>` (ruta `/public/tienda_online/carrito/<token>/linea/<id>`, cabecera `X-Store-View`).
- `carrito/detalle/diseño.ts`: `EstadoCarrito`-like `LISTO | ACTUALIZANDO`, `ContextoCarrito { estado; error: string | null }`.
- `carrito/detalle/detalle.ts`: `cambiarCantidad(ctx, {lineaId, cantidad})`, `borrarLinea(ctx, {lineaId})`; siempre devuelven LISTO.
- `carrito/detalle/maquina.ts`: sin tests directos.

## Mapeo spec -> test

| Spec | Fichero | Qué |
|---|---|---|
| carga-02 | dominio.test.ts | estaVacio |
| carga-03 | dominio.test.ts | hayPagoIniciado |
| lineas-02 | dominio.test.ts | cantidadValida |
| lineas-03, 04 | infraestructura.test.ts + detalle.test.ts | patch/delete, procesadores OK |
| lineas-05 | detalle.test.ts | 400 -> texto backend + recarga |
| lineas-06 | detalle.test.ts | 404/409 -> olvidarCarrito + aviso; sin token |
| carga-01, lineas-01, 07, totales-*, nada más | sin test (vista) | - |

Mensaje fijo: «Este carrito ya no está disponible» (literal en el test, no hay constante).
