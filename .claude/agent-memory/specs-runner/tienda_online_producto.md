# Memoria técnica — tienda_online / producto

Tests en `packages/contextos/src/tienda_online/producto/test/` (lanzar con `(cd packages/contextos && npx vitest run src/tienda_online/producto/)`).

## Ficheros a crear

- `producto/diseño.ts`: `ImagenProducto {url, alt, principal}`, `CategoriaProducto {id, nombre, slug}`, `FichaProducto` (camelCase; descripcionCorta/Larga, metaTitulo, metaDescripcion nullable).
- `producto/dominio.ts`: `imagenInicial`, `estaDisponible`, `limitarCantidad`, `metadatosFicha`.
- `producto/infraestructura.ts`: `getProducto(slug)`, `postLineaCarrito(token, referencia, cantidad): Promise<number>`.
- `producto/detalle/diseño.ts`: `EstadoFicha`, `ContextoFicha`.
- `producto/detalle/detalle.ts`: `contextoFichaInicial`, `cargarContexto(ctx, slug)`, `anadirAlCarrito(ctx)`.
- `producto/detalle/maquina.ts`: `getMaquina` (sin tests directos).

## Contexto

`ContextoFicha { estado: 'CARGANDO'|'LISTO'|'NO_ENCONTRADO'|'ERROR'|'AÑADIENDO'; ficha: FichaProducto|null; cantidad: number; aviso: string|null; error: string|null }`. `contextoFichaInicial` = estado CARGANDO, ficha null, cantidad 1, aviso null, error null. Los procesadores pueden devolver ctx o [ctx, eventos].

## Mapeo spec -> test

| Spec | Fichero | Qué |
|---|---|---|
| carga-01 | infraestructura.test.ts | getProducto (ruta, cabeceras, mapeo) |
| carga-02/03/04 | detalle.test.ts | cargarContexto |
| carga-05 | dominio.test.ts | metadatosFicha |
| contenido-01 | dominio.test.ts | imagenInicial |
| contenido-05, anadir-02 | dominio.test.ts | estaDisponible |
| anadir-01 | dominio.test.ts | limitarCantidad |
| anadir-03 | detalle.test.ts + infraestructura.test.ts | anadirAlCarrito, postLineaCarrito |
| anadir-04, 05 | detalle.test.ts | anadirAlCarrito |
| contenido-02/03/04/06 | sin test (vista) | - |
