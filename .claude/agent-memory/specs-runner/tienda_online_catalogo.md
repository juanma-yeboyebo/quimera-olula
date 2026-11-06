# Memoria técnica — tienda_online / catalogo

Tests: `cd packages/contextos && npx vitest run src/tienda_online/catalogo/ src/tienda_online/comun/`
Trampa Vitest: `beforeEach(() => { mock.mockReset(); })` siempre con llaves.

## Ficheros clave
- `catalogo/diseño.ts`: ProductoCatalogo, CategoriaTienda, FiltrosCatalogo, OrdenCatalogo, EstadoCatalogo, ContextoCatalogo
- `catalogo/dominio.ts`: criteriaCatalogo, filtrosDesdeUrl, filtrosAUrl, añadirPagina, hayMas, rutaCategoria, estaDisponible
- `catalogo/infraestructura.ts`: getCatalogo, getCategorias
- `catalogo/maestro/maestro.ts`: cargarCatalogo, siguientePagina, filtrosCambiados (procesadores; sin evento, ver contexto)
- `catalogo/maestro/maquina.ts`: getMaquina
- `comun/dominio.ts`: formatearPrecio

## Contexto
ContextoCatalogo = { estado: EstadoCatalogo; productos: ProductoCatalogo[]; total: number; pagina: number; filtros: FiltrosCatalogo }
Procesadores devuelven el contexto (no tupla). cargarCatalogo(ctx): pág 1 con ctx.filtros, catch -> ERROR. siguientePagina(ctx): pág ctx.pagina+1, añadirPagina. filtrosCambiados(ctx, payload FiltrosCatalogo): pág 1, sustituye, guarda filtros.

## Mapeo spec -> test (carpeta catalogo/test/)
| Spec | Fichero |
|---|---|
| carga-01 | dominio.test.ts, infraestructura.test.ts |
| carga-02, 03 | infraestructura.test.ts |
| carga-04, 05 | maestro.test.ts |
| paginacion-01 | dominio.test.ts, maestro.test.ts |
| paginacion-02 | maestro.test.ts |
| paginacion-03 | dominio.test.ts, maestro.test.ts |
| filtros-01..03, rutas-01, rutas-02 | dominio.test.ts |
| categorias-01 | infraestructura.test.ts |
| categorias-02..04 | dominio.test.ts |
| tarjeta-02 | comun/test/dominio.test.ts |
| tarjeta-03 | dominio.test.ts |
| rutas-01 (vista), filtros-04, tarjeta-01/04/05 | sin test (UI) |
