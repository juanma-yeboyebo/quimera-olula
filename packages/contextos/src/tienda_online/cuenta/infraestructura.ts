import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { criteriaQuery } from "@olula/lib/infraestructura.ts";
import { CarritoTienda } from "../comun/diseño.ts";
import { CarritoApi, cabecerasTienda, carritoDesdeApi } from "../comun/infraestructura.ts";
import { codigoStoreViewActivo } from "../comun/storeview.ts";
import TiendaOnline_Urls from "../comun/urls.ts";
import { CuentaTienda, DatosRegistro, PedidoDetalle, PedidoResumen } from "./diseño.ts";
import { aNulo, criteriaPedidos } from "./dominio.ts";

const urls = new TiendaOnline_Urls();

export type DireccionRegistroApi = {
    nombre_via: string;
    numero: string | null;
    cod_postal: string;
    ciudad: string;
    provincia: string | null;
    pais_id: string;
};

export type RegistroApi = {
    email: string;
    password: string;
    nombre: string;
    id_fiscal: string;
    telefono: string | null;
    direccion: DireccionRegistroApi;
};

export type DireccionCuentaApi = {
    id: string;
    nombre_via: string;
    numero: string | null;
    cod_postal: string;
    ciudad: string;
    provincia: string | null;
    pais_id: string;
    envio: boolean;
    facturacion: boolean;
};

export type CuentaApi = {
    email: string;
    nombre: string;
    id_fiscal: string | null;
    telefono: string | null;
    cliente_id: string | null;
    direcciones: DireccionCuentaApi[];
};

export type PedidoResumenApi = {
    id: string;
    codigo: string;
    fecha: string;
    total: number;
    divisa: string;
    servido: string;
};

export type LineaPedidoApi = {
    referencia: string;
    descripcion: string;
    cantidad: number;
    precio: number;
    importe: number;
};

export type PedidoDetalleApi = PedidoResumenApi & {
    neto: number;
    total_iva: number;
    lineas: LineaPedidoApi[];
};

const cabeceras = () => cabecerasTienda(codigoStoreViewActivo() ?? "");

export const cuentaDesdeApi = (c: CuentaApi): CuentaTienda => ({
    email: c.email,
    nombre: c.nombre,
    idFiscal: c.id_fiscal,
    telefono: c.telefono,
    clienteId: c.cliente_id,
    direcciones: c.direcciones.map((d) => ({
        id: d.id,
        nombreVia: d.nombre_via,
        numero: d.numero,
        codPostal: d.cod_postal,
        ciudad: d.ciudad,
        provincia: d.provincia,
        paisId: d.pais_id,
        envio: d.envio,
        facturacion: d.facturacion,
    })),
});

export const pedidoResumenDesdeApi = (p: PedidoResumenApi): PedidoResumen => ({
    id: p.id,
    codigo: p.codigo,
    fecha: p.fecha,
    total: p.total,
    divisa: p.divisa,
    servido: p.servido,
});

export const pedidoDetalleDesdeApi = (p: PedidoDetalleApi): PedidoDetalle => ({
    ...pedidoResumenDesdeApi(p),
    neto: p.neto,
    totalIva: p.total_iva,
    lineas: p.lineas.map((l) => ({
        referencia: l.referencia,
        descripcion: l.descripcion,
        cantidad: l.cantidad,
        precio: l.precio,
        importe: l.importe,
    })),
});

export const registroAApi = (d: DatosRegistro): RegistroApi => ({
    email: d.email,
    password: d.password,
    nombre: d.nombre,
    id_fiscal: d.idFiscal,
    telefono: aNulo(d.telefono),
    direccion: {
        nombre_via: d.direccion.nombreVia,
        numero: aNulo(d.direccion.numero),
        cod_postal: d.direccion.codPostal,
        ciudad: d.direccion.ciudad,
        provincia: aNulo(d.direccion.provincia),
        pais_id: d.direccion.paisId,
    },
});

export const postRegistro = async (body: RegistroApi): Promise<void> => {
    await RestAPI.post(urls.REGISTRO, body, "Error al crear la cuenta", cabeceras());
};

export const postAsociarCarrito = async (token: string): Promise<void> => {
    await RestAPI.post(
        `${urls.CARRITO_USUARIO}/${token}/asociar`,
        {},
        "Error al asociar el carrito",
        cabeceras(),
    );
};

export const getCarritoUsuario = async (): Promise<CarritoTienda | null> => {
    try {
        const respuesta = await RestAPI.get<{ datos: CarritoApi }>(
            urls.CARRITO_USUARIO,
            "Error al cargar el carrito",
            cabeceras(),
        );
        return carritoDesdeApi(respuesta.datos);
    } catch (e) {
        if ((e as { estado?: number })?.estado === 404) return null;
        throw e;
    }
};

export const getCuenta = async (): Promise<CuentaTienda> => {
    const respuesta = await RestAPI.get<{ datos: CuentaApi }>(
        urls.CUENTA,
        "Error al cargar la cuenta",
        cabeceras(),
    );
    return cuentaDesdeApi(respuesta.datos);
};

export const getPedidos = async (
    pagina: number,
): Promise<{ pedidos: PedidoResumen[]; total: number }> => {
    const { filtro, orden, paginacion } = criteriaPedidos(pagina);
    const respuesta = await RestAPI.get<{ datos: PedidoResumenApi[]; total: number }>(
        `${urls.PEDIDO}${criteriaQuery(filtro, orden, paginacion)}`,
        "Error al cargar los pedidos",
        cabeceras(),
    );
    return { pedidos: respuesta.datos.map(pedidoResumenDesdeApi), total: respuesta.total };
};

export const getPedido = async (id: string): Promise<PedidoDetalle> => {
    const respuesta = await RestAPI.get<{ datos: PedidoDetalleApi }>(
        `${urls.PEDIDO}/${id}`,
        "Error al cargar el pedido",
        cabeceras(),
    );
    return pedidoDetalleDesdeApi(respuesta.datos);
};
