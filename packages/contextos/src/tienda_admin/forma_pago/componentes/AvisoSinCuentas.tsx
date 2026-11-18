import { QAviso } from "@olula/componentes/atomos/qaviso.tsx";
import { puede } from "@olula/lib/dominio.ts";
import { Link } from "react-router";
import { AVISO_SIN_CUENTAS, REGLA_CREDENCIALES, URL_CREDENCIALES } from "../dominio.ts";

export const AvisoSinCuentas = () => (
    <QAviso variante="advertencia">
        {AVISO_SIN_CUENTAS}
        {puede(REGLA_CREDENCIALES) && (
            <>
                {" "}
                <Link to={URL_CREDENCIALES}>Ir a Credenciales</Link>
            </>
        )}
    </QAviso>
);
