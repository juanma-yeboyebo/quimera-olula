import { MetaModelo } from "@olula/lib/dominio.ts";
import { articuloDeLineaValido, getTipoArticulo } from "../comun/dominio.ts";
import {
    LineaPedido,
    ModeloLineaPedido,
    NuevaLineaPedido,
    Pedido,
} from "./diseño.ts";

export const pedidoPendiente = (pedido: Pedido): boolean =>
    pedido.recibido === null || pedido.recibido === "No";

export const descripcionRecibido = (pedido: Pedido): string =>
    pedido.recibido ?? "No";

export const pedidoAlbaranable = (pedido: Pedido): boolean => pedido.recibido !== "Sí";

export const etiquetaLinea = (linea: LineaPedido): string =>
    linea.referencia ? `${linea.referencia}: ${linea.descripcion}` : linea.descripcion;

export const modeloLineaPedido = (linea: LineaPedido): ModeloLineaPedido => ({
    ...linea,
    tipoArticulo: getTipoArticulo(linea),
});

export const articuloLineaBloqueado = (linea: LineaPedido): boolean =>
    linea.cerrada || linea.cantidadRecibida > 0;

export const metaLineaPedido: MetaModelo<ModeloLineaPedido> = {
    campos: {
        descripcion: { requerido: true },
        cantidad: { requerido: true, tipo: "decimal", decimales: 2 },
        pvpUnitario: { requerido: true, tipo: "moneda", decimales: 2 },
        dtoPorcentual: { tipo: "decimal", decimales: 2 },
        dtoLineal: { tipo: "moneda", decimales: 2 },
        tipoIrpf: { tipo: "decimal", decimales: 2 },
        pvpSinDto: { tipo: "moneda", bloqueado: true },
        pvpTotal: { tipo: "moneda", bloqueado: true },
        tipoIva: { tipo: "decimal", bloqueado: true },
        tipoRecargo: { tipo: "decimal", bloqueado: true },
        cantidadRecibida: { tipo: "decimal", bloqueado: true },
    },
    validacion: articuloDeLineaValido,
};

export const metaNuevaLineaPedido: MetaModelo<NuevaLineaPedido> = {
    campos: {
        referencia: { tipo: "texto" },
        descripcion: { tipo: "texto" },
        cantidad: { requerido: true, tipo: "decimal", decimales: 2 },
        pvpUnitario: {
            requerido: (linea) => linea.tipoArticulo === "libre",
            tipo: "moneda",
            decimales: 2,
        },
    },
    validacion: articuloDeLineaValido,
};

export const nuevaLineaPedidoVacia = (): NuevaLineaPedido => ({
    tipoArticulo: "registrado",
    referencia: null,
    descripcion: "",
    descripcionArticulo: null,
    cantidad: 1,
    pvpUnitario: null,
});
