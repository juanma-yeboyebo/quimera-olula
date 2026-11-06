import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { criteriaQuery } from "@olula/lib/infraestructura.ts";
import { CarritoApi, CarritoTienda } from "../comun/diseño.ts";
import { cabecerasTienda, carritoDesdeApi } from "../comun/infraestructura.ts";
import { codigoStoreViewActivo } from "../comun/storeview.ts";
import TiendaOnline_Urls from "../comun/urls.ts";
import {
    CuentaApi,
    CuentaTienda,
    PedidoDetalle,
    PedidoDetalleApi,
    PedidoResumen,
    PedidoResumenApi,
    RegistroApi,
} from "./diseño.ts";
import { criteriaPedidos } from "./dominio.ts";

const urls = new TiendaOnline_Urls();

const URL_REGISTRO = "/public/tienda_online/cuenta/registro";
const URL_CUENTA = "/tienda_online/cuenta/yo";
const URL_PEDIDO = "/tienda_online/cuenta/pedido";

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

export const postRegistro = async (body: RegistroApi): Promise<void> => {
    await RestAPI.post(URL_REGISTRO, body, "Error al crear la cuenta", cabeceras());
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
        URL_CUENTA,
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
        `${URL_PEDIDO}${criteriaQuery(filtro, orden, paginacion)}`,
        "Error al cargar los pedidos",
        cabeceras(),
    );
    return { pedidos: respuesta.datos.map(pedidoResumenDesdeApi), total: respuesta.total };
};

export const getPedido = async (id: string): Promise<PedidoDetalle> => {
    const respuesta = await RestAPI.get<{ datos: PedidoDetalleApi }>(
        `${URL_PEDIDO}/${id}`,
        "Error al cargar el pedido",
        cabeceras(),
    );
    return pedidoDetalleDesdeApi(respuesta.datos);
};
