import { CambioDivisa } from "#/ventas/comun/componentes/moleculas/CambiarDivisa/diseño.ts";
import { CambioProveedor } from "#/compras/comun/componentes/moleculas/CambioProveedor/diseño.ts";
import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { ejecutarListaProcesos, MetaModelo } from "@olula/lib/dominio.ts";
import {
    accionesListaEntidades,
    listaEntidadesInicial,
    ProcesarListaEntidades,
} from "@olula/lib/ListaEntidades.ts";
import { LineaPedido, Pedido } from "../diseño.ts";
import { pedidoPendiente } from "../dominio.ts";
import {
    cerrarLineaPedido,
    getLineasPedido,
    getPedido,
    patchPedido,
} from "../infraestructura.ts";
import { ContextoDetallePedido, EstadoDetallePedido } from "./diseño.ts";

type ProcesarDetalle = ProcesarContexto<EstadoDetallePedido, ContextoDetallePedido>;

const pipePedido = ejecutarListaProcesos<EstadoDetallePedido, ContextoDetallePedido>;

const conLineas = (fn: ProcesarListaEntidades<LineaPedido>) =>
    (ctx: ContextoDetallePedido) => ({ ...ctx, lineas: fn(ctx.lineas) });

export const Lineas = accionesListaEntidades(conLineas);

export const metaPedido: MetaModelo<Pedido> = {
    campos: {
        codigo: { bloqueado: true },
        serieId: { bloqueado: true },
        numero: { bloqueado: true },
        ejercicioId: { bloqueado: true },
        nombreProveedor: { bloqueado: true },
        idFiscal: { bloqueado: true },
        recibido: { bloqueado: true },
        fecha: { requerido: true, tipo: "fecha" },
        fechaEntrada: { tipo: "fecha" },
        numeroProveedor: {},
        divisaId: { bloqueado: true },
        tasaConversion: { tipo: "decimal", decimales: 6, bloqueado: true },
        observaciones: { tipo: "texto" },
        neto: { tipo: "moneda", bloqueado: true },
        totalIva: { tipo: "moneda", bloqueado: true },
        totalRecargo: { tipo: "moneda", bloqueado: true },
        totalIrpf: { tipo: "moneda", bloqueado: true },
        total: { tipo: "moneda", bloqueado: true },
        totalDivisaEmpresa: { tipo: "moneda", bloqueado: true },
        recargoFinanciero: { tipo: "moneda", bloqueado: true },
    },
    editable: (pedido: Pedido, campo?: string) =>
        pedidoPendiente(pedido) ||
        campo === "observaciones" ||
        campo === "fechaEntrada",
};

export const pedidoVacio = (): Pedido => ({
    id: '',
    codigo: '',
    ejercicioId: '',
    serieId: '',
    numero: '',
    fecha: new Date(),
    fechaEntrada: new Date(),
    numeroProveedor: null,
    proveedorId: null,
    nombreProveedor: '',
    idFiscal: '',
    almacenId: null,
    nombreAlmacen: null,
    formaPagoId: '',
    nombreFormaPago: null,
    grupoIvaNegocioId: '',
    divisaId: '',
    tasaConversion: 1,
    neto: 0,
    totalIva: 0,
    totalRecargo: 0,
    totalIrpf: 0,
    total: 0,
    totalDivisaEmpresa: 0,
    recargoFinanciero: 0,
    recibido: null,
    observaciones: null,
});

export const contextoDetallePedidoInicial: ContextoDetallePedido = {
    estado: 'INICIAL',
    pedido: pedidoVacio(),
    lineas: listaEntidadesInicial<LineaPedido>(),
};

export const refrescarPedido: ProcesarDetalle = async (contexto) => {
    const pedido = await getPedido(contexto.pedido.id);
    return [
        { ...contexto, pedido },
        [["pedido_cambiado", pedido]],
    ];
};

export const refrescarLineas: ProcesarDetalle = async (contexto) => {
    const lineas = await getLineasPedido(contexto.pedido.id);
    return Lineas.recargar(contexto, { datos: lineas, total: lineas.length });
};

export const guardarPedido = async (
    contexto: ContextoDetallePedido,
    pedido: Pedido
): Promise<void> => {
    const campos: (keyof Pedido)[] = [
        "fecha",
        "fechaEntrada",
        "numeroProveedor",
        "grupoIvaNegocioId",
        "formaPagoId",
        "almacenId",
        "observaciones",
    ];

    const cambios = Object.fromEntries(
        campos
            .filter((campo) => pedido[campo] !== contexto.pedido[campo])
            .map((campo) => [campo, pedido[campo]])
    );

    if (Object.keys(cambios).length === 0) return;

    await patchPedido(pedido.id, cambios);
};

export const cambiarDivisa: ProcesarDetalle = async (contexto, payload) => {
    const cambio = payload as CambioDivisa;
    await patchPedido(contexto.pedido.id, {
        divisaId: cambio.divisa_id,
        tasaConversion: cambio.tasa_conversion,
    });
    return pipePedido(contexto, [refrescarPedido, 'ABIERTO']);
};

export const cambiarProveedor: ProcesarDetalle = async (contexto, payload) => {
    const cambio = payload as CambioProveedor;
    await patchPedido(contexto.pedido.id, {
        proveedorId: cambio.proveedorId || null,
        nombreProveedor: cambio.nombreProveedor,
        idFiscal: cambio.idFiscal,
    });
    return pipePedido(contexto, [refrescarPedido, 'ABIERTO']);
};

const activarLineaPorId = (id: string) => async (contexto: ContextoDetallePedido) => ({
    ...contexto,
    lineas: {
        ...contexto.lineas,
        activo: contexto.lineas.lista.find((l) => l.id === id) ?? null,
    },
});

const activarLineaPorIndice = (indice: number) => async (contexto: ContextoDetallePedido) => {
    const lineas = contexto.lineas.lista;
    return {
        ...contexto,
        lineas: {
            ...contexto.lineas,
            activo:
                lineas.length > 0
                    ? indice >= 0 && indice < lineas.length
                        ? lineas[indice]
                        : lineas[lineas.length - 1]
                    : null,
        },
    };
};

export const onLineaCreada: ProcesarDetalle = async (contexto, payload) => {
    const id = payload as string;
    return pipePedido(contexto, [refrescarPedido, refrescarLineas, activarLineaPorId(id)]);
};

export const onLineaCambiada: ProcesarDetalle = async (contexto, payload) => {
    const id = payload as string;
    return pipePedido(contexto, [refrescarPedido, refrescarLineas, activarLineaPorId(id)]);
};

export const onLineaBorrada: ProcesarDetalle = async (contexto, payload) => {
    const id = payload as string;
    const indice = contexto.lineas.lista.findIndex((l) => l.id === id);
    return pipePedido(contexto, [
        refrescarPedido,
        refrescarLineas,
        activarLineaPorIndice(indice),
    ]);
};

export const cerrarLineaProceso: ProcesarDetalle = async (contexto) => {
    const linea = contexto.lineas.activo;
    if (!linea) return contexto;

    await cerrarLineaPedido(contexto.pedido.id, linea.id, !linea.cerrada);
    return pipePedido(contexto, [
        refrescarPedido,
        refrescarLineas,
        activarLineaPorId(linea.id),
    ]);
};

const cargarPedido: (_: string) => ProcesarDetalle = (idPedido) => async (contexto) => {
    const [pedido, lineas] = await Promise.all([
        getPedido(idPedido),
        getLineasPedido(idPedido),
    ]);

    return pipePedido(contexto, [
        async (ctx) => ({
            ...ctx,
            pedido,
            lineas: { lista: lineas, total: lineas.length, activo: lineas[0] ?? null },
        }),
        'ABIERTO',
    ]);
};

export const limpiarContexto: ProcesarDetalle = async (contexto) => ({
    ...contexto,
    estado: 'INICIAL',
    pedido: pedidoVacio(),
    lineas: listaEntidadesInicial<LineaPedido>(),
});

export const cargarContexto: ProcesarDetalle = async (contexto, payload) => {
    const idPedido = payload as string;
    if (idPedido) {
        return cargarPedido(idPedido)(contexto);
    }
    return limpiarContexto(contexto);
};
