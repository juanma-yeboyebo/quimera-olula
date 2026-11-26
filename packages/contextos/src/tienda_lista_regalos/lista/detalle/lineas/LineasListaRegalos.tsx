import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { formatearMoneda } from "@olula/lib/dominio.ts";
import { ListaEntidades } from "@olula/lib/ListaEntidades.js";
import { BorrarLineaListaRegalos } from "../../borrar_linea/BorrarLineaListaRegalos.tsx";
import { CambiarLineaListaRegalos } from "../../cambiar_linea/CambiarLineaListaRegalos.tsx";
import { CrearLineaListaRegalos } from "../../crear_linea/CrearLineaListaRegalos.tsx";
import { LineaListaRegalos, ListaRegalos } from "../../diseño.ts";
import { totalesLista } from "../../dominio.ts";
import { LiberarLineaListaRegalos } from "../../liberar_linea/LiberarLineaListaRegalos.tsx";
import { EstadoDetalleListaRegalos } from "../diseño.ts";
import { LineasLista } from "./LineasLista.tsx";
import "./LineasListaRegalos.css";

export const LineasListaRegalos = ({
    lista,
    lineas,
    estado,
    publicar,
}: {
    lista: ListaRegalos;
    lineas: ListaEntidades<LineaListaRegalos>;
    estado: EstadoDetalleListaRegalos;
    publicar: EmitirEvento;
}) => {
    const totales = totalesLista(lineas.lista);
    return (
        <div className="LineasListaRegalos">
            <dl className="LineasListaRegalos-totales">
                <div>
                    <dt>Total de la lista</dt>
                    <dd>{formatearMoneda(totales.total, "EUR")}</dd>
                </div>
                <div>
                    <dt>Vendido</dt>
                    <dd>{formatearMoneda(totales.vendido, "EUR")}</dd>
                </div>
                <div>
                    <dt>Reservado sin pagar</dt>
                    <dd>{formatearMoneda(totales.reservado, "EUR")}</dd>
                </div>
            </dl>
            <div className="botones maestro-botones">
                <QBoton onClick={() => publicar("alta_linea_solicitada")}>
                    Añadir producto
                </QBoton>
            </div>
            <LineasLista
                lineas={lineas.lista}
                seleccionada={lineas.activo?.id}
                publicar={publicar}
            />
            {estado === "CREANDO_LINEA" && (
                <CrearLineaListaRegalos lista={lista} publicar={publicar} />
            )}
            {lineas.activo && estado === "CAMBIANDO_LINEA" && (
                <CambiarLineaListaRegalos
                    lista={lista}
                    linea={lineas.activo}
                    publicar={publicar}
                />
            )}
            {lineas.activo && estado === "LIBERANDO_LINEA" && (
                <LiberarLineaListaRegalos
                    lista={lista}
                    linea={lineas.activo}
                    publicar={publicar}
                />
            )}
            {lineas.activo && estado === "BORRANDO_LINEA" && (
                <BorrarLineaListaRegalos
                    lista={lista}
                    linea={lineas.activo}
                    publicar={publicar}
                />
            )}
        </div>
    );
};
