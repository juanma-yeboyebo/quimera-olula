import { ProcesarContexto } from "@olula/lib/diseño.ts";
import { ejecutarListaProcesos, MetaModelo } from "@olula/lib/dominio.ts";
import { ReciboCompra } from "../diseño.js";
import { getReciboCompra } from "../infraestructura.js";
import { ContextoDetalleReciboCompra, EstadoDetalleReciboCompra } from "./diseño.js";

type ProcesarDetalle = ProcesarContexto<EstadoDetalleReciboCompra, ContextoDetalleReciboCompra>;

const pipeRecibo = ejecutarListaProcesos<EstadoDetalleReciboCompra, ContextoDetalleReciboCompra>;

export const metaReciboCompra: MetaModelo<ReciboCompra> = {
    campos: {
        codigo: { tipo: "texto" },
        estado: { tipo: "texto" },
        importe: { tipo: "moneda" },
        fechaEmision: { tipo: "fecha" },
        fechaVencimiento: { tipo: "fecha" },
        nombreProveedor: { tipo: "texto" },
        idFiscal: { tipo: "texto" },
        facturaId: { tipo: "texto" },
    },
    editable: () => false,
};

export const reciboCompraInicial = (): ReciboCompra => ({
    id: '',
    facturaId: null,
    codigo: '',
    fechaEmision: null,
    fechaVencimiento: null,
    estado: '',
    importe: 0,
    proveedorId: null,
    nombreProveedor: '',
    idFiscal: '',
});

export const contextoDetalleReciboCompraInicial: ContextoDetalleReciboCompra = {
    estado: 'INICIAL',
    recibo: reciboCompraInicial(),
};

export const cargarReciboCompra: (_: string) => ProcesarDetalle =
    (idRecibo) => async (contexto) => {
        const recibo = await getReciboCompra(idRecibo);
        return pipeRecibo(contexto, [
            async (ctx) => ({ ...ctx, recibo }),
            'ABIERTO',
        ]);
    };

export const cargarContexto: ProcesarDetalle = async (contexto, payload) => {
    const idRecibo = payload as string;
    if (idRecibo) {
        return cargarReciboCompra(idRecibo)(contexto);
    }
    return { ...contexto, estado: 'INICIAL', recibo: reciboCompraInicial() };
};
