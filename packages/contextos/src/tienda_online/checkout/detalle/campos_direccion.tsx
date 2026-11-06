import { DireccionCheckout, ErroresCheckout } from "../diseño.ts";
import { CampoFormulario } from "./campo_formulario.tsx";

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
    const campo = (clave: keyof DireccionCheckout, etiqueta: string) => (
        <CampoFormulario
            etiqueta={etiqueta}
            valor={direccion[clave]}
            error={errores[`${prefijo}.${clave}`]}
            deshabilitado={deshabilitado}
            onCambiar={(valor) => onCambiar({ ...direccion, [clave]: valor })}
        />
    );

    return (
        <div className="checkout-direccion">
            {campo("tipoVia", "Tipo de vía")}
            {campo("nombreVia", "Vía")}
            {campo("numero", "Número")}
            {campo("otros", "Otros")}
            {campo("codPostal", "Código postal")}
            {campo("ciudad", "Ciudad")}
            {campo("provincia", "Provincia")}
            {campo("paisId", "País")}
            {campo("telefono", "Teléfono de contacto")}
        </div>
    );
};
