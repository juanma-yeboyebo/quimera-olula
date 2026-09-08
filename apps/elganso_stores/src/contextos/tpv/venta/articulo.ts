import ApiUrls from "#/ventas/comun/urls.ts";
import { RestAPI } from "@olula/lib/api/rest_api.ts";

// Talla/color/barcode de un artículo (tabla atributosarticulos): usado al
// añadir línea, tanto por el modal manual (elegir talla) como por el
// escaneo directo (resolver barcode -> artículo+talla).

export type TallaArticulo = { talla: string; barcode: string };

export type TallasArticuloApi = {
  tallas: TallaArticulo[];
  codbarras: string | null;
};

export type ArticuloPorBarcodeApi = {
  referencia: string;
  descripcion: string;
  talla: string;
  pvp: number;
};

export const getTallasArticulo = (referencia: string) =>
  RestAPI.get<TallasArticuloApi>(`${new ApiUrls().ARTICULO}/${referencia}/talla`);

export const getArticuloPorBarcode = (barcode: string) =>
  RestAPI.get<ArticuloPorBarcodeApi>(
    `${new ApiUrls().ARTICULO}/por-barcode/${barcode}`
  );
