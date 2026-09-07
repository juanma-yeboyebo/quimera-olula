import { EmitirEvento } from "@olula/lib/diseño.ts";
import { ListaEntidades } from "@olula/lib/ListaEntidades.ts";
import { BorrarLineaFactura } from "../../borrar_linea/BorrarLineaFactura.tsx";
import { CambiarLineaFactura } from "../../cambiar_linea/CambiarLineaFactura.tsx";
import { CrearLineaFactura } from "../../crear_linea/CrearLineaFactura.tsx";
import { Factura, LineaFactura } from "../../diseño.ts";
import { facturaEditable } from "../../dominio.ts";
import { EstadoDetalleFactura } from "../diseño.ts";
import { LineasLista } from "./LineasLista.tsx";

export const LineasFactura = ({
    factura,
    lineas,
    estado,
    publicar,
}: {
    factura: Factura;
    lineas: ListaEntidades<LineaFactura>;
    estado: EstadoDetalleFactura;
    publicar: EmitirEvento;
}) => {
    const activa = lineas.activo;
    const editable = facturaEditable(factura);

    const acciones = [
        {
            texto: "Nueva",
            onClick: () => publicar("alta_linea_solicitada"),
        },
        {
            texto: "Editar",
            onClick: () => publicar("cambio_linea_solicitado"),
            deshabilitado: !activa,
        },
        {
            icono: "eliminar",
            texto: "Borrar",
            advertencia: true,
            onClick: () => publicar("baja_linea_solicitada"),
            deshabilitado: !activa,
        },
    ];

    return (
        <>
            <LineasLista
                lineas={lineas.lista}
                divisa={factura.divisaId}
                seleccionada={activa?.id}
                acciones={editable ? acciones : undefined}
                publicar={publicar}
            />
            {estado === "CREANDO_LINEA" && (
                <CrearLineaFactura factura={factura} publicar={publicar} />
            )}
            {activa && estado === "CAMBIANDO_LINEA" && (
                <CambiarLineaFactura factura={factura} linea={activa} publicar={publicar} />
            )}
            {activa && estado === "BORRANDO_LINEA" && (
                <BorrarLineaFactura factura={factura} linea={activa} publicar={publicar} />
            )}
        </>
    );
};
