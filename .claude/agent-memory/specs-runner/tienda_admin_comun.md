# Memoria técnica — tienda_admin (comun, articulo, categoria, pedido, configuracion)

Contexto de administración de la tienda para el personal del ERP, en `packages/contextos/src/tienda_admin/`. No está añadido a ninguna app: solo exporta `RouterFactoryTiendaAdmin` (`router_factory.ts`), `menuTiendaAdmin` (`menu.ts`) y `FactoryTiendaAdmin.menu` (`factory.ts`). Cada app ERP con tienda lo cablea por su cuenta.

Tests (solo cuando lo pida Juanma): `cd packages/contextos && npx vitest run src/tienda_admin/`

## Ficheros clave

| Fichero | Contenido |
|---|---|
| `comun/dominio.ts` | `errorSlug`/`slugValido` (reglas del servidor, vacío válido), `errorLongitud`, `textoContador`, `elegirWebsite`, `conflictoDeError` (409 -> campo `slug`/`codigo`/null por texto de la descripción) |
| `comun/errores.ts` | `ejecutarConConflicto(accion, intentar, alConflicto)`: el 409 va al campo, el resto al `intentar` del `ContextoError` |
| `comun/website_store.ts` | Almacén `useSyncExternalStore`: `{activo, websites}`; `useWebsiteActivo`, `useNombreWebsiteActivo`, `fijarWebsiteActivo`, `fijarWebsites`, `reiniciarWebsiteActivo` |
| `comun/componentes/SelectorWebsite.tsx` | Carga `GET /tienda_admin/website`, elige el primero activo, un solo website = solo el nombre |
| `articulo/dominio.ts` | `filtroArticulos`/`criteriaArticulos`, distintivos, `cambiosDePublicacion`, `resumenDeArticulo`, metas de publicación y textos, `idsCategoriasEnOrden` |
| `articulo/infraestructura.ts` | Mappers y cuerpos de API (`publicacionAApi`, `textosAApi`, `categoriasAApi`), ids de categoría numéricos al enviar |
| `articulo/maestro/` | Listado con filtros propios en el contexto (`filtros`), `Listado` con `mostrarFiltros={false}`; el criteria solo lleva orden y paginación |
| `articulo/detalle/` | Máquina INICIAL/ABIERTO/QUITANDO; las pestañas llaman a la API y emiten `publicacion_guardada`/`textos_guardados`/`categorias_guardadas` -> `refrescarArticulo` (emite `articulo_cambiado` al maestro) |
| `categoria/dominio.ts` | Funciones puras del árbol: `moverEntreHermanas`, `resolverSoltado`, `zonaDeSoltado`, `padresPosibles`, `motivoNoBorrable` |
| `categoria/maestro/ArbolCategorias.tsx` | Árbol con drag and drop nativo + botones Subir/Bajar/Mover a… |
| `categoria/detalle/`, `crear/`, `borrar/`, `mover/` | Detalle sin `useModelo` autoguardado: botón Guardar y 409 en el campo |

## Patrones

- Ids de categoría y de artículo son `string` en el dominio (cumplen `Entidad`); se convierten a número en el cuerpo de la API.
- Los eventos sin entrada en el estado actual de la máquina lanzan error (`procesarEvento`): cada evento debe existir en el estado donde se emite.
- Varios `emitir` en el mismo tick pisan el contexto (usan el `ctx` del render): por eso el detalle de artículo recibe `{id, websiteId}` en un único evento.
- Los procesadores de lista (`recargarArticulos`) leen filtros y criteria del contexto, no del payload.
- Tests con `vi.mock("#/tienda_admin/.../infraestructura.ts")` y `await import(...)`; `beforeEach(() => { mock.mockReset(); })` siempre con llaves.

## Mapeo spec -> test

| Spec | Fichero |
|---|---|
| menu-01, menu-02 | `comun/test/menu.test.ts` |
| website-01 | `comun/test/dominio.test.ts`, `website_store.test.ts`, `infraestructura.test.ts` |
| articulo-publicacion-02, categoria-crear-01 (409) | `comun/test/dominio.test.ts`, `errores.test.ts` |
| articulo-maestro-01/02 | `articulo/test/dominio.test.ts`, `maestro.test.ts`, `infraestructura.test.ts` |
| articulo-detalle-01, publicacion-01 | `articulo/test/detalle.test.ts`, `dominio.test.ts`, `infraestructura.test.ts` |
| articulo-textos-01, categorias-01 | `articulo/test/dominio.test.ts`, `infraestructura.test.ts` |
| articulo-fotos-01 | sin test (UI) |
| categoria-arbol-01/02/03 | `categoria/test/dominio.test.ts`, `maestro.test.ts`, `infraestructura.test.ts` |
| categoria-detalle-01, borrar-01 | `categoria/test/detalle.test.ts`, `dominio.test.ts` |
| pedido-01, configuracion-01 | `pedido/test/pedido.test.ts`, `configuracion/test/configuracion.test.ts` |

## Estado (2026-11-08)

Código y tests escritos sin lanzar tests, type-check ni lint (decisión de Juanma). Specs sin marcar `[x]`.
