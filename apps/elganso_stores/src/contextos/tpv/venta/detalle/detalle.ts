import { metaVenta, ventaVacia } from "#/ventas/venta/dominio.ts";
import { ProcesarContexto } from "@olula/lib/diseño.js";
import { ejecutarListaProcesos, MetaCampo, MetaModelo, modeloEsEditable, publicar } from "@olula/lib/dominio.ts";
import { accionesListaEntidades, listaEntidadesInicial, ProcesarListaEntidades } from "@olula/lib/ListaEntidades.js";
import { CambioCliente } from "#/ventas/comun/componentes/moleculas/CambioClienteVenta/diseño.ts";
import {
    CambiosDatosCliente,
    LineaVentaTpv,
    PagoVentaTpv,
    VentaTpv
} from "../diseño.ts";
import {
    getLineas,
    getPagos,
    getVenta,
    patchCambiarCliente,
    patchCambiarDescuento,
    patchCantidadLinea,
    patchDatosCliente,
} from "../infraestructura.ts";
import { ContextoVentaTpv, EstadoVentaTpv } from "./diseño.ts";

const conPagos = (fn: ProcesarListaEntidades<PagoVentaTpv>) =>
    (ctx: ContextoVentaTpv<VentaTpv>) => ({ ...ctx, pagos: fn(ctx.pagos) });

export const Pagos = accionesListaEntidades(conPagos);

export const ventaTpvVacia = (): VentaTpv => ({
    ...ventaVacia,
    cliente: null,
    pendiente: 0,
    pagado: 0,
    puntoVentaId: '',
    puntoVenta: '',
    abierta: false,
    estado: '',
    lineas: [],
})

const camposVentaTpv: Record<string, MetaCampo<VentaTpv>> = {
    ...metaVenta.campos,
    fecha: { tipo: "fecha", requerido: true, bloqueado: true },
    agente_id: { bloqueado: true },
};

// En El Ganso una venta TPV se cierra al cobrar: solo es editable mientras
// sigue "Abierta" (Cerrada/Anulada quedan bloqueadas, igual que en Eneboo).
export const metaVentaTpv: MetaModelo<VentaTpv> = {
    campos: camposVentaTpv,
    editable: (venta: VentaTpv) => venta.abierta,
};

export const editable = modeloEsEditable<VentaTpv>(metaVentaTpv);

export const ventaTpvVaciaObjeto: VentaTpv = ventaTpvVacia();

export const ventaTpvVaciaContexto = (): VentaTpv => ({ ...ventaTpvVaciaObjeto });

type ProcesarVentaTpv = ProcesarContexto<EstadoVentaTpv, ContextoVentaTpv<VentaTpv>>;

const pipeVentaTpv = ejecutarListaProcesos<EstadoVentaTpv, ContextoVentaTpv<VentaTpv>>;

const cargarVenta: (_: string) => ProcesarVentaTpv = (idVenta) =>
    async (contexto) => {
        const venta = await getVenta(idVenta);
        return {
            ...contexto,
            venta,
        }
    }

export const refrescarVenta: ProcesarVentaTpv = async (contexto) => {
    const venta = await getVenta(contexto.venta.id);
    return [
        {
            ...contexto,
            venta: {
                ...contexto.venta,
                ...venta
            },
        },
        [["venta_cambiada", venta]]
    ]
}

export const abiertaOCerrada: ProcesarVentaTpv = async (contexto) => {
    return {
        ...contexto,
        estado: contexto.venta.abierta ? "ABIERTO" : "SERVIDO"
    }
}

export const refrescarLineas: ProcesarVentaTpv = async (contexto) => {
    const lineas = await getLineas(contexto.venta.id);
    return {
        ...contexto,
        venta: {
            ...contexto.venta,
            lineas: lineas as LineaVentaTpv[]
        }
    }
}

export const activarLinea: ProcesarVentaTpv = async (contexto, payload) => {
    const lineaActiva = payload as LineaVentaTpv;
    return {
        ...contexto,
        lineaActiva
    }
}

const actualizarLineaActiva: ProcesarVentaTpv = async (contexto) => {
    if (!contexto.lineaActiva) return contexto;
    const lineaActiva = (contexto.venta.lineas as LineaVentaTpv[]).find(
        l => l.id === contexto.lineaActiva?.id
    ) ?? contexto.lineaActiva;
    return { ...contexto, lineaActiva };
}

const activarLineaPorIndice = (indice: number) => async (contexto: ContextoVentaTpv<VentaTpv>) => {
    const lineas = contexto.venta.lineas as LineaVentaTpv[];
    const lineaActiva = lineas.length > 0
        ? indice >= 0 && indice < lineas.length
            ? lineas[indice]
            : lineas[lineas.length - 1]
        : null

    return {
        ...contexto,
        lineaActiva
    }
}

export const refrescarPagos: ProcesarVentaTpv = async (contexto) => {
    const pagos = await getPagos(contexto.venta.id);
    return Pagos.recargar(contexto, { datos: pagos, total: pagos.length });
}

export const getContextoVacio: ProcesarVentaTpv = async (contexto) => {
    return {
        ...contexto,
        estado: 'INICIAL',
        venta: ventaTpvVaciaContexto(),
        lineaActiva: null,
        pagos: listaEntidadesInicial<PagoVentaTpv>(),
    }
}

export const cargarContexto: ProcesarVentaTpv = async (contexto, payload) => {
    const idVenta = payload as string;
    if (idVenta) {
        return pipeVentaTpv(
            contexto,
            [
                cargarVenta(idVenta),
                refrescarLineas,
                refrescarPagos,
                abiertaOCerrada,
                activarLineaPorIndice(0),
            ],
            payload
        );
    } else {
        return getContextoVacio(contexto);
    }
}

export const borrarVenta: ProcesarVentaTpv = async (contexto) => {
    return pipeVentaTpv(contexto, [
        publicar('venta_borrada', (ctx) => ctx.venta.id),
        getContextoVacio
    ]);
}

export const cambiarCliente: ProcesarVentaTpv = async (contexto, payload) => {
    const cambio = payload as CambioCliente;
    await patchCambiarCliente(contexto.venta.id, cambio);

    return pipeVentaTpv(contexto, [
        refrescarVenta,
        refrescarLineas,
        'ABIERTO',
    ]);
}

export const cambiarDatosCliente: ProcesarVentaTpv = async (contexto, payload) => {
    const cambios = payload as CambiosDatosCliente;
    await patchDatosCliente(contexto.venta.id, cambios);

    return pipeVentaTpv(contexto, [
        refrescarVenta,
        refrescarLineas,
        'ABIERTO',
    ]);
}

export const cambiarDescuento: ProcesarVentaTpv = async (contexto, payload) => {
    const { dto_porcentual } = payload as { dto_porcentual: number };
    await patchCambiarDescuento(contexto.venta.id, dto_porcentual);

    return pipeVentaTpv(contexto, [
        refrescarVenta,
        'ABIERTO',
    ]);
}

export const crearLinea: ProcesarVentaTpv = async (contexto) => {
    return pipeVentaTpv(contexto, [
        refrescarVenta,
        refrescarLineas,
        'ABIERTO',
    ]);
}

export const cambiarLinea: ProcesarVentaTpv = async (contexto) => {
    return pipeVentaTpv(contexto, [
        refrescarVenta,
        refrescarLineas,
        actualizarLineaActiva,
        'ABIERTO',
    ]);
}

export const cambiarCantidadLinea: ProcesarVentaTpv = async (contexto, payload) => {
    const { lineaId, cantidad } = payload as { lineaId: string, cantidad: number };

    const linea = (contexto.venta.lineas as LineaVentaTpv[]).find((l: LineaVentaTpv) => l.id === lineaId);
    if (!linea) return contexto;

    await patchCantidadLinea(contexto.venta.id, linea, cantidad);

    const lineasActualizadas = await getLineas(contexto.venta.id);
    const ventaActualizada = await getVenta(contexto.venta.id);

    return {
        estado: "ABIERTO" as EstadoVentaTpv,
        venta: {
            ...ventaActualizada,
            lineas: lineasActualizadas
        },
        ventaInicial: contexto.ventaInicial,
        lineaActiva: lineasActualizadas.find(l => l.id === lineaId) || null,
        pagos: contexto.pagos,
    };
}

export const borrarLinea: ProcesarVentaTpv = async (contexto, payload) => {
    const idLinea = payload as string;
    const indiceLineaActiva = (contexto.venta.lineas as LineaVentaTpv[]).findIndex((l: LineaVentaTpv) => l.id === idLinea);

    return pipeVentaTpv(contexto, [
        refrescarVenta,
        refrescarLineas,
        activarLineaPorIndice(indiceLineaActiva),
        'ABIERTO',
    ]);
}

// El propio modal (PagarEfectivoVentaTpv/PagarTarjetaVentaTpv) llama a
// postPago y solo emite "pago_..._hecho" tras el éxito — aquí solo se
// refresca, para no duplicar el pago si este processor volviera a llamar
// a la API.
export const pagoHecho: ProcesarVentaTpv = async (contexto) => {
    return pipeVentaTpv(contexto, [
        refrescarVenta,
        refrescarLineas,
        refrescarPagos,
        'ABIERTO',
    ]);
}

// El propio modal (BorrarPagoVentaTpv) ya llama a deletePago antes de
// emitir "pago_borrado" — aquí solo se actualiza el contexto local.
export const borrarPago: ProcesarVentaTpv = async (contexto, payload) => {
    const idPago = payload as string;

    return pipeVentaTpv(contexto, [
        (ctx) => Pagos.quitar(ctx, idPago),
        refrescarVenta,
        refrescarLineas,
        'ABIERTO',
    ]);
}
