---
name: coder
description: >
  Especialista en programar funcionalidades para el proyecto Quimera Olula (monorepo pnpm React/TypeScript ERP).
  Conoce la arquitectura DDD de 4 ficheros (diseño.ts, dominio.ts, infraestructura.ts, vistas/),
  las máquinas de estado con useMaquina, los patrones ProcesarContexto y pipeline,
  las llamadas REST con RestAPI, y los componentes UI (QModal, QBoton, QInput).
  Úsalo cuando el usuario pida implementar nuevas funcionalidades, estados, modales, llamadas a API,
  o modificaciones que afecten a los módulos de ventas (pedido, presupuesto, albarán, factura, tpv/venta).
---

# Coder — Quimera Olula

## Arquitectura

Leer [references/arquitectura.md](references/arquitectura.md) antes de escribir código.
Contiene: convención 4 ficheros, máquinas de estado, ProcesarContexto, patrones PATCH,
componentes modales, HookModelo, genéricos con T extends Venta, y alias de imports.

## Flujo de trabajo

### 1. Explorar antes de modificar

Leer siempre los ficheros relevantes antes de editar. Para funcionalidades que afecten a los 5 módulos de ventas, leer al menos uno de cada tipo como referencia antes de aplicar el patrón en los demás.

### 2. Añadir una nueva funcionalidad transversal (5 módulos)

Sigue este orden:

1. **Componente modal** (si aplica) → crear `diseño.ts`, `dominio.ts`, `ComponenteNombre.tsx` en `ventas/comun/componentes/moleculas/NombreComponente/`
2. **diseño.ts de cada módulo** → añadir el nuevo estado a `EstadoX` (union type)
3. **infraestructura.ts de cada módulo** → añadir la función `patchXxx`
4. **dominio.ts / detalle.ts de cada módulo** → añadir la función `ProcesarContexto` que llama a la infra y hace pipe
5. **maquina.ts de cada módulo** → añadir el evento en `ABIERTO`/`ABIERTA` y el nuevo bloque de estado
6. **Componente Detalle*.tsx** → importar el modal y renderizarlo condicionalmente `{estado === "NUEVO_ESTADO" && <Modal publicar={emitir} />}`

### 3. Estructura de un nuevo estado en maquina.ts

```typescript
ABIERTO: {
    // ...eventos existentes...
    nueva_accion_solicitada: "NUEVO_ESTADO",
},
NUEVO_ESTADO: {
    accion_confirmada: [procesarFn],        // o [procesarFn, "ABIERTO"] si hace transición
    accion_cancelada: "ABIERTO",
},
```

### 4. Verificación

Después de implementar, ejecutar:
```bash
pnpm type-check
```
Si hay errores en apps que consumen `@olula/ctx` (symlink a `packages/contextos`), revisar si algún cambio de interfaz en `diseño.ts` rompe el contrato esperado por esas apps.
