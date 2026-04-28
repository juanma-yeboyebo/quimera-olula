# Spec-Driven Development en Quimera Olula

## 1. Qué es SDD y por qué aplicarlo aquí

Spec-Driven Development (SDD) es una metodología donde **la especificación es el artefacto principal**, no el código. La especificación define el comportamiento del sistema de forma declarativa, y tanto la implementación como los tests se derivan de ella.

En el contexto de desarrollo asistido por IA, las specs actúan como **contratos ejecutables** entre el desarrollador y el agente de IA: delimitan qué debe generarse, con qué restricciones, y cómo verificarlo.

### Por qué encaja en Quimera Olula

El repositorio ya tiene un embrión natural de SDD:

- **`diseño.ts`** define interfaces, tipos de estado y firmas de funciones — es un contrato de tipos.
- **`useMaquina`** define el comportamiento como una tabla de transiciones declarativa.
- **`MetaModelo`** especifica validación y metadatos de campos de forma declarativa.

Lo que falta es una **capa de especificación en lenguaje natural** que capture la intención de negocio, los criterios de aceptación y las reglas de extensión por cliente. Esa capa es lo que SDD añade.

### Principio rector

> El código es desechable y regenerable. La spec es la fuente de verdad.

---

## 2. Estructura de ficheros de spec

### 2.1 Ubicación

Las specs se ubican junto al código que especifican, con extensión `.spec.md`:

```
packages/contextos/src/ventas/pedido/
├── diseño.ts
├── dominio.ts
├── infraestructura.ts
├── pedido.spec.md              ← spec del dominio base
├── detalle/
│   ├── maquina.ts
│   ├── dominio.ts
│   └── detalle.spec.md         ← spec de la máquina de estados
└── vistas/
    └── DetallePedido.spec.md   ← spec de la vista (opcional)
```

Para specs de app/cliente:

```
apps/guanabana/src/contextos/ventas/pedido/
├── diseño.ts
├── infraestructura.ts
└── pedido.guanabana.spec.md    ← spec de extensiones del cliente
```

### 2.2 Formato de una spec

```markdown
# [Nombre del dominio/funcionalidad]

## Contexto
Breve descripción del problema o necesidad que resuelve.

## Entidad
Campos principales y su semántica de negocio (no tipos TS, sino significado).

## Comportamiento

### [Nombre de la acción]
- **Precondición**: estado o condición necesaria
- **Entrada**: qué datos recibe
- **Resultado**: qué cambia en el sistema
- **Criterio de aceptación**:
  - Dado [contexto], cuando [acción], entonces [resultado]
  - Dado [contexto], cuando [acción con error], entonces [manejo de error]

## Estados (si aplica máquina de estados)

| Estado | Descripción | Transiciones posibles |
|--------|------------|----------------------|
| ABIERTO | El documento es editable | → CREANDO_LINEA, BORRANDO, CAMBIANDO_CLIENTE |

## API

| Operación | Endpoint | Payload resumido |
|-----------|----------|-----------------|
| Obtener | GET /ventas/pedido/:id | — |
| Modificar cliente | PATCH /ventas/pedido/:id | `{ cambios: { cliente: {...} } }` |

## Extensiones por app
Lista de apps que extienden esta funcionalidad y qué añaden (o referencia a la spec de app).

## Restricciones
- Reglas de negocio invariantes
- Límites de rendimiento si aplica
```

### 2.3 Spec de extensión por app

Cuando una app (cliente) extiende la funcionalidad base:

```markdown
# Pedido — Extensión Guanabana

**Extiende**: packages/contextos/src/ventas/pedido/pedido.spec.md

## Campos adicionales
- `feria_ui` (texto): nombre de feria asociada al pedido, se muestra en la tabla y en el detalle.

## Comportamiento modificado

### Guardar pedido
- Se envía `feria_id` adicional en el payload PATCH.

## Comportamiento nuevo
(si aplica)

## Vista
- TabDatos muestra el campo feria en el formulario.
- MetaTabla incluye columna feria.
```

---

## 3. Flujo de trabajo

### 3.1 Nueva funcionalidad (spec-first)

```
1. ESPECIFICAR  →  2. REVISAR  →  3. IMPLEMENTAR  →  4. VERIFICAR
     (humano +       (humano)       (agente coder)     (agente + CI)
      agente spec)
```

**Paso 1 — Especificar**: El desarrollador describe la funcionalidad. El agente `spec-writer` genera un borrador de spec estructurado según el formato §2.2. Si afecta a varias apps, genera también las specs de extensión.

**Paso 2 — Revisar**: El desarrollador revisa la spec, ajusta criterios de aceptación, y la aprueba.

**Paso 3 — Implementar**: El agente `coder` implementa siguiendo la spec aprobada. La spec le da:
- Los tipos a definir en `diseño.ts`
- Los estados y transiciones para `maquina.ts`
- Las funciones de infraestructura necesarias
- Los criterios de aceptación que se convierten en tests

**Paso 4 — Verificar**: Se ejecutan `pnpm type-check`, `pnpm test` y se comprueba que los criterios de aceptación se cumplen.

### 3.2 Modificación de funcionalidad existente

```
1. LOCALIZAR SPEC  →  2. ACTUALIZAR SPEC  →  3. REVISAR  →  4. IMPLEMENTAR  →  5. VERIFICAR
```

Si la spec no existe todavía (funcionalidad legacy), primero se genera (ver §6 Migración).

### 3.3 Funcionalidad transversal (5 módulos de ventas)

Cuando una funcionalidad afecta a Pedido, Presupuesto, Albarán, Factura y Venta TPV:

1. Se escribe **una spec base** en `ventas/comun/` describiendo el comportamiento genérico.
2. Se anotan las **diferencias por módulo** dentro de la misma spec (tabla o secciones).
3. El agente `coder` implementa módulo a módulo, siguiendo el orden del skill actual:
   - Componente modal → diseño.ts → infraestructura.ts → dominio.ts → maquina.ts → vista

### 3.4 Extensión por cliente

Cuando un cliente necesita funcionalidad adicional:

1. Se crea la spec de extensión (§2.3) en la carpeta de la app.
2. La spec referencia la spec base y solo describe las diferencias.
3. El agente implementa los overrides en la app usando el patrón Factory existente.

---

## 4. Sistema de agentes

### 4.1 Agentes propuestos

| Agente | Rol | Herramientas | Modelo |
|--------|-----|-------------|--------|
| **spec-writer** | Genera y actualiza specs a partir de requisitos del usuario | Read, Glob, Grep, Write | opus |
| **coder** | Implementa código a partir de specs aprobadas | Read, Glob, Grep, Edit, Write | sonnet |
| **designer** | Revisa UI/UX de componentes React | Read, Glob, Grep, Edit, Write | sonnet |
| **verifier** | Valida que la implementación cumple la spec | Read, Glob, Grep, Bash | haiku |

### 4.2 Cambios respecto a los agentes actuales

**Se mantienen:**
- **coder** — Se refuerza su prompt para que siempre consulte la spec antes de implementar. El skill `references/arquitectura.md` sigue vigente.
- **designer** — Sin cambios. Actúa sobre la capa visual.

**Se crean:**
- **spec-writer** — Nuevo. Su responsabilidad es generar specs bien estructuradas. Conoce el formato §2.2, la lista de dominios, las apps existentes, y los patrones del repo. Cuando el usuario describe una funcionalidad, genera el borrador de spec.
- **verifier** — Nuevo. Compara la implementación contra la spec: revisa que los tipos de `diseño.ts` coincidan con la spec, que los estados de la máquina estén todos, que los tests cubran los criterios de aceptación, y que `type-check` y `test` pasen.

### 4.3 Flujo entre agentes

```
Usuario describe requisito
        │
        ▼
   spec-writer ──→ genera .spec.md
        │
        ▼
   Usuario revisa y aprueba
        │
        ▼
      coder ──→ implementa código (diseño → infra → dominio → maquina → vista → test)
        │
        ▼
    verifier ──→ valida spec vs implementación
        │
        ▼
   designer (opcional) ──→ revisa UI si hay vistas nuevas
```

### 4.4 Cuándo usar cada agente

| Caso de uso | Agente(s) |
|-------------|-----------|
| "Quiero añadir descuento por volumen a pedidos" | spec-writer → coder → verifier |
| "Revisa la accesibilidad del detalle de factura" | designer |
| "Añade campo X al pedido de Guanabana" | spec-writer (extension spec) → coder → verifier |
| "Corrige bug: el total no se recalcula" | coder (bug trivial, no necesita spec) |
| "Refactoriza el patrón de pagos en TPV" | spec-writer (documenta estado actual + cambios) → coder → verifier |
| "Migra el módulo de albarán a SDD" | spec-writer (genera spec desde código) → verifier |

---

## 5. Specs multi-app

### 5.1 Jerarquía de specs

```
packages/contextos/src/ventas/pedido/pedido.spec.md      ← spec base (todos los clientes)
apps/guanabana/src/.../pedido/pedido.guanabana.spec.md    ← extensión Guanabana
apps/cabrera/src/.../pedido/pedido.cabrera.spec.md        ← extensión Cabrera
```

### 5.2 Reglas

1. **La spec base es universal.** Describe el comportamiento que comparten todas las apps. Nunca incluye lógica específica de un cliente.
2. **La spec de extensión hereda.** Comienza con `Extiende: [ruta a spec base]` y solo describe diferencias: campos nuevos, comportamientos modificados, reglas de negocio adicionales.
3. **Los conflictos se resuelven en la extensión.** Si un cliente necesita un comportamiento diferente al base, la spec de extensión lo indica explícitamente con la sección "Comportamiento modificado".
4. **El agente coder consulta ambas specs.** Al implementar para una app concreta, lee la spec base + la extensión de esa app.

### 5.3 Patrón de extensión en código (referencia)

La extensión se implementa mediante el patrón Factory ya existente:

- `diseño.ts` de la app extiende la interfaz base (`PedidoGUA extends Pedido`)
- `infraestructura.ts` de la app añade campos al payload (`payloadPatchPedidoGUA`)
- `factory.ts` de la app sustituye el módulo (`FactoryGUA extends FactoryOlula`)
- Las vistas de la app pueden reemplazar o envolver componentes base

---

## 6. Migración de funcionalidades existentes

### 6.1 Estrategia: migración incremental bajo demanda

No se migra todo de golpe. Se genera la spec de una funcionalidad existente cuando:
- Se va a modificar o extender
- Se detecta un bug y se quiere documentar el comportamiento correcto
- Se quiere añadir tests

### 6.2 Proceso de migración

```
1. EXTRAER SPEC  →  2. REVISAR  →  3. AÑADIR TESTS  →  4. (Opcional) REFACTORIZAR
```

**Paso 1 — Extraer spec**: El agente `spec-writer` lee los ficheros existentes (diseño.ts, maquina.ts, dominio.ts, infraestructura.ts) y genera una spec que describe el comportamiento actual.

**Paso 2 — Revisar**: El desarrollador verifica que la spec refleja correctamente el comportamiento deseado. Se ajustan criterios de aceptación.

**Paso 3 — Añadir tests**: El agente `coder` genera tests basados en los criterios de aceptación de la spec. Usa el patrón existente (Vitest + procesarEvento).

**Paso 4 — Refactorizar (opcional)**: Si la spec revela inconsistencias o deuda técnica, se usa el flujo SDD completo para mejorar.

### 6.3 Prioridad de migración sugerida

1. **Módulos de ventas** (pedido, presupuesto, albarán, factura, venta TPV) — son los más complejos y los que más se modifican.
2. **TPV** (arqueo, sesión) — flujos con múltiples estados y lógica de pagos.
3. **Almacén** (transferencias) — ya tiene tests, es buen candidato para completar la spec.
4. **Dominios simples** (auth, valores, CRM) — migración trivial cuando se toquen.

---

## 7. Derivación de tests desde specs

Los criterios de aceptación en formato Given/When/Then se mapean directamente a tests de máquina de estados:

### Spec:
```markdown
### Añadir línea
- Dado un pedido ABIERTO, cuando se solicita añadir línea, entonces el estado pasa a CREANDO_LINEA
- Dado estado CREANDO_LINEA, cuando se confirma con referencia y cantidad, entonces se crea la línea y vuelve a ABIERTO
- Dado estado CREANDO_LINEA, cuando se cancela, entonces vuelve a ABIERTO sin cambios
```

### Test generado:
```typescript
describe("Añadir línea", () => {
    test("solicitar añadir línea pasa a CREANDO_LINEA", async () => {
        const maquina = getMaquina();
        const ctx = { ...contextoAbierto };
        const [resultado] = await procesarEvento(maquina, ctx, "alta_linea_solicitada");
        expect(resultado.estado).toBe("CREANDO_LINEA");
    });

    test("confirmar creación vuelve a ABIERTO con línea nueva", async () => {
        const ctx = { ...contextoCreandoLinea };
        const [resultado] = await procesarEvento(maquina, ctx, "alta_linea_lista", nuevaLinea);
        expect(resultado.estado).toBe("ABIERTO");
        expect(resultado.pedido.lineas).toContainEqual(expect.objectContaining({ referencia: "REF01" }));
    });

    test("cancelar creación vuelve a ABIERTO sin cambios", async () => {
        const ctx = { ...contextoCreandoLinea };
        const [resultado] = await procesarEvento(maquina, ctx, "crear_linea_cancelado");
        expect(resultado.estado).toBe("ABIERTO");
    });
});
```

---

## 8. Resumen del flujo completo

```
┌─────────────────────────────────────────────────────────┐
│                    FLUJO SDD                            │
│                                                         │
│  1. Usuario describe requisito (texto libre)            │
│           │                                             │
│           ▼                                             │
│  2. spec-writer genera .spec.md                         │
│     - Lee código existente para contexto                │
│     - Identifica si afecta a múltiples módulos/apps     │
│     - Genera spec base + extensiones si necesario       │
│           │                                             │
│           ▼                                             │
│  3. Usuario revisa y aprueba la spec                    │
│           │                                             │
│           ▼                                             │
│  4. coder implementa siguiendo la spec                  │
│     - diseño.ts → infraestructura.ts → dominio.ts       │
│     - maquina.ts → vistas/ → tests                     │
│           │                                             │
│           ▼                                             │
│  5. verifier comprueba spec vs código                   │
│     - Tipos coinciden con spec                          │
│     - Estados de máquina completos                      │
│     - Tests cubren criterios de aceptación              │
│     - type-check + test pasan                           │
│           │                                             │
│           ▼                                             │
│  6. designer revisa UI (si hay vistas nuevas)           │
│           │                                             │
│           ▼                                             │
│  7. Entrega                                             │
└─────────────────────────────────────────────────────────┘
```

---

## Referencias

- [Thoughtworks: Spec-Driven Development (2025)](https://www.thoughtworks.com/en-us/insights/blog/agile-engineering-practices/spec-driven-development-unpacking-2025-new-engineering-practices)
- [Augment Code: Practitioner's Guide to SDD](https://www.augmentcode.com/guides/what-is-spec-driven-development)
- [InfoQ: Spec-Driven Development — Architecture Becomes Executable](https://www.infoq.com/articles/spec-driven-development/)
- [Wikipedia: Spec-Driven Development](https://en.wikipedia.org/wiki/Spec-driven_development)
- [Universal Dev Standards: SDD](https://github.com/AsiaOstrich/universal-dev-standards/blob/main/core/spec-driven-development.md)
