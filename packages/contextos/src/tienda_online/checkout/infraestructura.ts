import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { cabecerasTienda } from "../comun/infraestructura.ts";
import { codigoStoreViewActivo } from "../comun/storeview.ts";
import TiendaOnline_Urls from "../comun/urls.ts";

const urls = new TiendaOnline_Urls();

const cabeceras = () => cabecerasTienda(codigoStoreViewActivo() ?? "");

export const patchDatosCheckout = async (
    token: string,
    body: Record<string, unknown>,
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
