import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QCheckbox } from "@olula/componentes/atomos/qcheckbox.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QSelect } from "@olula/componentes/atomos/qselect.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext, useMemo, useState } from "react";
import { FormaPago } from "#/comun/componentes/formapago.tsx";
import { ejecutarConConflicto } from "../../comun/errores.ts";
import { AvisoSinCuentas } from "../componentes/AvisoSinCuentas.tsx";
import { SelectorCuentaStripe, useCuentasStripe } from "../componentes/SelectorCuentaStripe.tsx";
import { esTarjeta, metaNuevaFormaPago, nuevaFormaPagoVacia, opcionesDestino, opcionesTipo } from "../dominio.ts";
import { postFormaPago } from "../infraestructura.ts";

export const CrearFormaPago = ({
    websiteId,
    publicar,
}: {
    websiteId: number;
    publicar: EmitirEvento;
}) => {
    const inicial = useMemo(nuevaFormaPagoVacia, []);
    const { modelo, uiProps, valido } = useModelo(metaNuevaFormaPago, inicial);
    const { intentar } = useContext(ContextoError);
    const cuentas = useCuentasStripe();
    const [errorCodigo, setErrorCodigo] = useState<string | null>(null);
    const tarjeta = esTarjeta(modelo);

    const crear = async () => {
        setErrorCodigo(null);
        let id = "";
        const ok = await ejecutarConConflicto(
            async () => {
                id = await postFormaPago(websiteId, modelo);
            },
            intentar,
            (conflicto) => setErrorCodigo(conflicto.mensaje),
        );
        if (ok) await publicar("forma_pago_creada", id);
    };

    const codigo = uiProps("codigo");

    return (
        <QModal
            abierto={true}
            nombre="crearFormaPago"
            titulo="Nueva forma de pago"
            onCerrar={() => publicar("alta_de_forma_pago_cancelada")}
        >
            <div className="CrearFormaPago">
                <quimera-formulario>
                    <QSelect label="Tipo" {...uiProps("tipo")} opciones={opcionesTipo} />
                    <QInput
                        label="Código"
                        {...codigo}
                        erroneo={codigo.erroneo || errorCodigo !== null}
                        textoValidacion={errorCodigo ?? codigo.textoValidacion}
                    />
                    <QInput label="Nombre" {...uiProps("nombre")} />
                    <QInput label="Descripción (opcional)" {...uiProps("descripcion")} />
                    <FormaPago {...uiProps("codpago")} nombre="codpago" />
                    <QSelect label="Genera" {...uiProps("destino")} opciones={opcionesDestino} />
                    {tarjeta && cuentas !== null && cuentas.length > 0 && (
                        <SelectorCuentaStripe cuentas={cuentas} {...uiProps("credencialId")} />
                    )}
                    {tarjeta && <QCheckbox label="Recibos cobrados al facturar" {...uiProps("recibosPagados")} />}
                </quimera-formulario>
                {tarjeta && cuentas !== null && cuentas.length === 0 && <AvisoSinCuentas />}
                <div className="botones maestro-botones">
                    <QBoton onClick={crear} deshabilitado={!valido}>
                        Crear
                    </QBoton>
                </div>
            </div>
        </QModal>
    );
};
