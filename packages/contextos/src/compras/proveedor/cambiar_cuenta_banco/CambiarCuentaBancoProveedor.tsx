import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useForm } from "@olula/lib/useForm.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback } from "react";
import { CuentaBancoProveedor, Proveedor } from "../diseño.ts";
import { metaCuentaBancoProveedor } from "../dominio.ts";
import { patchCuentaBancoProveedor } from "../infraestructura.ts";
import "./CambiarCuentaBancoProveedor.css";

export const CambiarCuentaBancoProveedor = ({
    proveedor,
    cuenta,
    publicar,
}: {
    proveedor: Proveedor;
    cuenta: CuentaBancoProveedor;
    publicar: EmitirEvento;
}) => {
    const { modelo, uiProps, valido } = useModelo(metaCuentaBancoProveedor, cuenta);

    const cambiar_ = useCallback(async () => {
        await patchCuentaBancoProveedor(proveedor.id, cuenta.id, modelo);
        publicar("cuenta_cambiada", cuenta.id);
    }, [modelo, proveedor.id, cuenta.id, publicar]);

    const cancelar_ = useCallback(
        () => publicar("cambio_de_cuenta_cancelado"),
        [publicar]
    );

    const [cambiar, cancelar] = useForm(cambiar_, cancelar_);

    return (
        <QModal
            abierto={true}
            nombre="cambiarCuentaBancoProveedor"
            titulo="Cambiar cuenta bancaria"
            onCerrar={cancelar}
        >
            <quimera-formulario>
                <QInput label="Descripción" {...uiProps("descripcion")} />
                <QInput label="IBAN" {...uiProps("iban")} />
                <QInput label="BIC" {...uiProps("bic")} />
                <QInput label="Código de cuenta" {...uiProps("codigoCuenta")} />
                <QInput label="País" {...uiProps("paisId")} />
                <QInput label="Entidad" {...uiProps("entidad")} />
                <QInput label="Agencia" {...uiProps("agencia")} />
                <QInput label="Dígito de control" {...uiProps("digitoControl")} />
                <QInput label="Cuenta" {...uiProps("cuenta")} />
            </quimera-formulario>
            <div className="botones maestro-botones">
                <QBoton onClick={cambiar} deshabilitado={!valido}>
                    Cambiar
                </QBoton>
            </div>
        </QModal>
    );
};
