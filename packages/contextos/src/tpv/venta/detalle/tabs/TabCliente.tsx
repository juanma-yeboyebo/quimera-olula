import { AgenteTpv as CompAgenteTpv } from "#/tpv/comun/componentes/AgenteTpv.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";

import { QDate } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.js";
import { direccionCompleta, FormModelo } from "@olula/lib/dominio.js";
import { CambiarCliente } from "../../cambiar_cliente/CambiarClienteVentaTpv.tsx";
import { VentaTpv } from "../../diseño.ts";
import { EstadoVentaTpv } from "../detalle.ts";
import "./TabCliente.css";

interface TabClienteProps {
  venta: VentaTpv;
  form: FormModelo;
  estado: EstadoVentaTpv,
  publicar: EmitirEvento;
}
// type Estado = "edicion" | "cambiando_cliente";

export const TabCliente = ({
  venta,
  form,
  estado,
  publicar = async () => {},
}: TabClienteProps) => {

    const { uiProps, editable } = form;

    return (
        <div className="TabCliente">
            <quimera-formulario>
                <CompAgenteTpv 
                    label='Agente'
                    {...uiProps("idAgente", "agente")}
                    nombre="tpv_venta_agente_id"
                />
                <QDate label="Fecha" {...uiProps("fecha")} />
 
                <div id='nombre'>
                    {`${venta.cliente?.nombre ?? ''} ${venta.cliente?.idFiscal ?? 'Factura Simplificada'}`}
                    <QBoton texto='Cambiar cliente'
                        onClick={() => publicar("cambio_cliente_solicitado")}
                        deshabilitado={!editable}
                        tamaño="pequeño"
                    />
                </div>

                <div id='direccion'>
                    {venta.cliente && direccionCompleta(venta.cliente?.direccion)}
                </div>

            </quimera-formulario>

            { estado === "CAMBIANDO_CLIENTE" &&
                <CambiarCliente
                    venta={venta}
                    publicar={publicar}
                />
            }
        </div>
    );
};
