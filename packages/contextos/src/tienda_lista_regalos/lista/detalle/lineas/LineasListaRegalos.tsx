import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { ListaEntidades } from "@olula/lib/ListaEntidades.js";
import { BorrarLineaListaRegalos } from "../../borrar_linea/BorrarLineaListaRegalos.tsx";
import { CambiarLineaListaRegalos } from "../../cambiar_linea/CambiarLineaListaRegalos.tsx";
import { CrearLineaListaRegalos } from "../../crear_linea/CrearLineaListaRegalos.tsx";
import { LineaListaRegalos, ListaRegalos } from "../../diseño.ts";
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
    return (
        <>
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
            {lineas.activo && estado === "BORRANDO_LINEA" && (
                <BorrarLineaListaRegalos
                    lista={lista}
                    linea={lineas.activo}
                    publicar={publicar}
                />
            )}
        </>
    );
};
