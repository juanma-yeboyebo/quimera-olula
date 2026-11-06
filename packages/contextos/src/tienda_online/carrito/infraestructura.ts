import { RestAPI } from "@olula/lib/api/rest_api.ts";
import { cabecerasTienda } from "../comun/infraestructura.ts";
import { codigoStoreViewActivo } from "../comun/storeview.ts";
import TiendaOnline_Urls from "../comun/urls.ts";

const urls = new TiendaOnline_Urls();

const cabeceras = () => cabecerasTienda(codigoStoreViewActivo() ?? "");

export const patchLineaCarrito = async (
    token: string,
    lineaId: number,
    cantidad: number,
): Promise<void> => {
    await RestAPI.patch(
        `${urls.CARRITO}/${token}/linea/${lineaId}`,
        { cantidad },
        "Error al cambiar la cantidad",
        cabeceras(),
    );
};

export const deleteLineaCarrito = async (token: string, lineaId: number): Promise<void> => {
    await RestAPI.delete(
        `${urls.CARRITO}/${token}/linea/${lineaId}`,
        "Error al quitar la línea",
        cabeceras(),
    );
};
