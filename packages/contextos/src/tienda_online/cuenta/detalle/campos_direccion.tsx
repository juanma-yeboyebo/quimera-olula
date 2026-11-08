import { CampoFormulario } from "../../comun/componentes/campo_formulario.tsx";
import { DireccionRegistro, ErroresRegistro } from "../diseño.ts";

export const CamposDireccionCuenta = ({
    direccion,
    errores,
    deshabilitado,
    onCambiar,
}: {
    direccion: DireccionRegistro;
    errores: ErroresRegistro;
    deshabilitado: boolean;
    onCambiar: (direccion: DireccionRegistro) => void;
}) => {
    const campo = (clave: keyof DireccionRegistro, etiqueta: string, autocompletar?: string) => (
        <CampoFormulario
            etiqueta={etiqueta}
            autocompletar={autocompletar}
            valor={direccion[clave]}
            error={errores[`direccion.${clave}`]}
            deshabilitado={deshabilitado}
            onCambiar={(valor) => onCambiar({ ...direccion, [clave]: valor })}
        />
    );

    return (
        <>
            <div className="ancho">{campo("nombreVia", "Vía", "address-line1")}</div>
            {campo("numero", "Número")}
            {campo("codPostal", "Código postal", "postal-code")}
            {campo("ciudad", "Ciudad", "address-level2")}
            {campo("provincia", "Provincia", "address-level1")}
            {campo("paisId", "País", "country")}
        </>
    );
};
