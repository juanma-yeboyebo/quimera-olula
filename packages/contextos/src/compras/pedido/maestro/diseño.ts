import { ListaActivaEntidades } from "@olula/lib/ListaActivaEntidades.ts";
import { AlbaranCreado } from "../../albaran/diseño.ts";
import { Pedido } from "../diseño.ts";

export type EstadoMaestroPedido =
    | 'INICIAL'
    | 'CREANDO'
    | 'ALBARANANDO'
    | 'ALBARAN_CREADO';

export type AlbaranGenerado = AlbaranCreado & {
    etiqueta: string;
};

export type ResultadoAlbaranar = {
    creados: AlbaranGenerado[];
    fallidos: string[];
};

export type ContextoMaestroPedido = {
    estado: EstadoMaestroPedido;
    pedidos: ListaActivaEntidades<Pedido>;
    seleccionados: string[];
    resultado: ResultadoAlbaranar | null;
};
