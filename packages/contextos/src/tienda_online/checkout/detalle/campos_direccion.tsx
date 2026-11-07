import { CampoFormulario } from "../../comun/componentes/campo_formulario.tsx";
import { DireccionCheckout, ErroresCheckout } from "../diseño.ts";

export const CamposDireccion = ({
    prefijo,
    direccion,
    errores,
    deshabilitado,
    onCambiar,
}: {
    prefijo: "direccionFacturacion" | "direccionEnvio";
    direccion: DireccionCheckout;
    errores: ErroresCheckout;
    deshabilitado: boolean;
    onCambiar: (direccion: DireccionCheckout) => void;
}) => {
    const seccion = prefijo === "direccionEnvio" ? "shipping" : "";

    const campo = (clave: keyof DireccionCheckout, etiqueta: string, autocompletar?: string) => (
        <CampoFormulario
            etiqueta={etiqueta}
            autocompletar={autocompletar && `${seccion} ${autocompletar}`.trim()}
            valor={direccion[clave]}
            error={errores[`${prefijo}.${clave}`]}
            deshabilitado={deshabilitado}
            onCambiar={(valor) => onCambiar({ ...direccion, [clave]: valor })}
        />
    );

    return (
        <div className="checkout-direccion">
            {campo("tipoVia", "Tipo de vía")}
            {campo("nombreVia", "Vía", "address-line1")}
            {campo("numero", "Número")}
            {campo("otros", "Otros", "address-line2")}
            {campo("codPostal", "Código postal", "postal-code")}
            {campo("ciudad", "Ciudad", "address-level2")}
            {campo("provincia", "Provincia", "address-level1")}
            {campo("paisId", "País", "country")}
            {campo("telefono", "Teléfono de contacto", "tel")}
        </div>
    );
};
