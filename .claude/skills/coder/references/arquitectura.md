# Arquitectura Quimera Olula

## Convención 4 ficheros por dominio

Cada módulo de negocio en `packages/contextos/src/<dominio>/` sigue esta estructura:

| Fichero | Propósito |
|---|---|
| `diseño.ts` | Interfaces TypeScript y firmas de tipos de funciones |
| `dominio.ts` | Lógica de negocio, funciones puras, entidades vacías |
| `infraestructura.ts` | Llamadas API con `RestAPI` — mapeo snake_case ↔ camelCase |
| `vistas/` o componentes `.tsx` | Componentes React |

## Módulos de ventas paralelos

Los 5 módulos que comparten la misma estructura y hay que actualizar en paralelo:

| Módulo | Ruta base | Estado principal |
|---|---|---|
| Pedido | `ventas/pedido/detalle/` | `ABIERTO` |
| Presupuesto | `ventas/presupuesto/detalle/` | `ABIERTO` |
| Albarán | `ventas/albaran/detalle/` | `ABIERTO` |
| Factura | `ventas/factura/detalle/` | `ABIERTO` |
| Venta TPV | `tpv/venta/detalle/` | `ABIERTA` |

Nota: Factura tiene su `EstadoFactura` y `ContextoFactura` en `ventas/factura/diseño.ts` (no en `detalle/diseño.ts`).
La Venta TPV tiene su lógica de detalle en `detalle/detalle.ts` (no `dominio.ts`).

## Máquina de estados (useMaquina)

```typescript
// diseño: Maquina<Estado, Contexto>
// Evento → string (transición directa) | ProcesarContexto[] (con/sin transición)
const maquina: Maquina<EstadoPedido, ContextoPedido> = {
    ABIERTO: {
        algo_solicitado: "NUEVO_ESTADO",           // transición directa
        otro_solicitado: [procesarFn, "NUEVO_ESTADO"],  // proceso + transición
        evento_simple: procesarFn,                 // proceso sin transición
    },
    NUEVO_ESTADO: {
        confirmado: [procesarFn, "ABIERTO"],
        cancelado: "ABIERTO",
    }
}
```

## ProcesarContexto — pipeline de transformaciones

```typescript
type ProcesarPedido = ProcesarContexto<EstadoPedido, ContextoPedido>;

// Función procesadora: recibe contexto (+payload), devuelve nuevo contexto
export const cambiarAlgo: ProcesarPedido = async (contexto, payload) => {
    const datos = payload as TipoDatos;
    await patchAlgo(contexto.pedido.id, datos);
    return pipePedido(contexto, [refrescarPedido, refrescarLineas, 'ABIERTO']);
}

// pipe: encadena múltiples procesadores
const pipePedido = ejecutarListaProcesos<EstadoPedido, ContextoPedido>;
```

## Infraestructura — patrón PATCH

```typescript
// Siempre usa RestAPI.patch/get/post/delete
export const patchCambiarAlgo = async (id: string, valor: number): Promise<void> => {
    await RestAPI.patch(`${baseUrl}/${id}`, { cambios: { campo: valor } }, "Mensaje de error");
};

// Con cambios anidados:
export const patchCambiarCliente = async (id: string, cambio: CambioCliente): Promise<void> => {
    await RestAPI.patch(`${baseUrl}/${id}`, {
        cambios: { cliente: { cliente_id: cambio.cliente_id } }
    }, "Error al cambiar cliente");
};
```

## URLs base por módulo

```typescript
// En infraestructura.ts de cada módulo:
const baseUrl = new ApiUrls().PEDIDO;   // ventas/pedido
const baseUrl = new ApiUrls().ALBARAN;  // ventas/albaran
// etc.

// TPV usa dos URLs:
const baseUrl = new ApiUrls().VENTA;         // /tpv/venta
const baseUrlFactura = new Ventas_Urls().FACTURA;  // /ventas/factura (para líneas/cliente)
```

## Componente modal (patrón CambiarDescuento / CambioClienteVenta)

```typescript
// diseño.ts
export type MiFormulario = { campo: number };

// dominio.ts
export const miFormularioVacio: MiFormulario = { campo: 0 };
export const metaMiFormulario: MetaModelo<MiFormulario> = {
    campos: {
        campo: { tipo: "decimal", requerido: true, decimales: 2, positivo: true },
    }
};

// MiComponente.tsx
interface Props { publicar: EmitirEvento; }
export const MiComponente = ({ publicar }: Props) => {
    const { modelo, uiProps, valido, init } = useModelo(metaMiFormulario, miFormularioVacio);
    const guardar = async () => {
        await publicar("evento_confirmado", modelo);
        init(miFormularioVacio);
    };
    const cancelar = () => { publicar("evento_cancelado"); init(miFormularioVacio); };
    return (
        <QModal abierto={true} nombre="mostrar" onCerrar={cancelar}>
            <div className="MiComponente">
                <h2>Título</h2>
                <quimera-formulario>
                    <QInput label="Campo" {...uiProps("campo")} />
                </quimera-formulario>
                <div className="botones maestro-botones">
                    <QBoton onClick={guardar} deshabilitado={!valido}>Aplicar</QBoton>
                </div>
            </div>
        </QModal>
    );
};
```

## Componente genérico con T extends Venta

```tsx
interface Props<T extends Venta> {
    modeloVenta: HookModelo<T>;
    publicar: EmitirEvento;
}
export const MiComponente = <T extends Venta>({ modeloVenta, publicar }: Props<T>) => {
    const { modelo } = modeloVenta;
    return <div>{modelo.total}</div>;
};
```

## MetaModelo — tipos de campo disponibles

```typescript
{ tipo: "texto" | "decimal" | "entero" | "fecha" | "booleano",
  requerido?: boolean,
  decimales?: number,
  positivo?: boolean,
  maximo?: number }
```

## Alias de imports en packages/contextos

- `#/` → `packages/contextos/src/`
- `@olula/lib/...` → `packages/lib/src/...`
- `@olula/componentes/...` → `packages/componentes/src/...`

## HookModelo<T>

```typescript
const { modelo, uiProps, valido, editable, init, set } = useModelo(meta, valorInicial);
// uiProps("campo") devuelve { nombre, valor, label?, onChange, deshabilitado }
// uiProps("campo1", "campo2") para búsquedas con display field
```

## Estructura de Venta y cliente

```typescript
// Venta base NO tiene cliente_id flat — usa objeto anidado en el modelo específico
interface Pedido extends Venta { cliente: ClienteVenta; ... }
interface ClienteVenta { cliente_id: string | null; nombre_cliente: string; ... }
// Acceso: modelo.cliente?.cliente_id
```

## Componentes UI disponibles

- `QModal` — modal dialog (`abierto`, `nombre`, `onCerrar`)
- `QBoton` — botón (`onClick`, `deshabilitado`)
- `QInput` — input de texto/número (`label`, `nombre`, `valor`, `onChange`, `deshabilitado`)
- `QCheckbox` — checkbox
- `quimera-formulario` — web component contenedor de formulario
