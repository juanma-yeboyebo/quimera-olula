import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { cabecerasTienda } from "../comun/infraestructura.ts";
import { codigoStoreViewActivo } from "../comun/storeview.ts";
import TiendaOnline_Urls from "../comun/urls.ts";
import { DatosCheckout, DireccionCheckout } from "./diseño.ts";
import { aNulo } from "./dominio.ts";

const urls = new TiendaOnline_Urls();

export type DireccionCheckoutApi = {
    nombre_via: string;
    tipo_via: string | null;
    numero: string | null;
    otros: string | null;
    cod_postal: string;
    ciudad: string;
    provincia: string | null;
    pais_id: string;
    telefono: string | null;
};

export type DatosCheckoutApi = {
    email: string;
    nombre: string;
    id_fiscal: string | null;
    telefono: string | null;
    direccion_facturacion: DireccionCheckoutApi;
    direccion_envio: DireccionCheckoutApi | null;
};

const direccionAApi = (d: DireccionCheckout): DireccionCheckoutApi => ({
    nombre_via: d.nombreVia,
    tipo_via: aNulo(d.tipoVia),
    numero: aNulo(d.numero),
    otros: aNulo(d.otros),
    cod_postal: d.codPostal,
    ciudad: d.ciudad,
    provincia: aNulo(d.provincia),
    pais_id: d.paisId,
    telefono: aNulo(d.telefono),
});

export const datosCheckoutAApi = (d: DatosCheckout): DatosCheckoutApi => ({
    email: d.email,
    nombre: d.nombre,
    id_fiscal: aNulo(d.idFiscal),
    telefono: aNulo(d.telefono),
    direccion_facturacion: direccionAApi(d.direccionFacturacion),
    direccion_envio: d.envioDistinto ? direccionAApi(d.direccionEnvio) : null,
});

const cabeceras = () => cabecerasTienda(codigoStoreViewActivo() ?? "");

export const patchDatosCheckout = async (
    token: string,
    body: DatosCheckoutApi,
): Promise<void> => {
    await RestAPI.patch(
        `${urls.CARRITO}/${token}/checkout`,
        body,
        "Error al guardar los datos",
        cabeceras(),
    );
};

export const postIniciarPago = async (token: string): Promise<string> => {
    const respuesta = await RestAPI.post(
        `${urls.CARRITO}/${token}/pago`,
        {},
        "Error al iniciar el pago",
        cabeceras(),
    );
    return (respuesta as unknown as { url: string }).url;
};

export const postCancelarPago = async (token: string): Promise<void> => {
    await RestAPI.post(
        `${urls.CARRITO}/${token}/pago/cancelar`,
        {},
        "Error al cancelar el pago",
        cabeceras(),
    );
};
