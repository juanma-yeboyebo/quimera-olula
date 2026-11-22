import { AutocompletarTienda } from "../../comun/componentes/autocompletar_tienda.tsx";
import { CampoFormulario } from "../../comun/componentes/campo_formulario.tsx";
import { PaisTienda } from "../../cuenta/diseño.ts";
import { opcionesPais } from "../../cuenta/dominio.ts";
import { DireccionCheckout, ErroresCheckout } from "../diseño.ts";

const OBLIGATORIOS: (keyof DireccionCheckout)[] = ["nombreVia", "codPostal", "ciudad", "paisId"];

export const CamposDireccion = ({
    prefijo,
    direccion,
    paises,
    errores,
    deshabilitado,
    onCambiar,
}: {
    prefijo: "direccionFacturacion" | "direccionEnvio";
    direccion: DireccionCheckout;
    paises: PaisTienda[];
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
            obligatorio={OBLIGATORIOS.includes(clave)}
            error={errores[`${prefijo}.${clave}`]}
            deshabilitado={deshabilitado}
            onCambiar={(valor) => onCambiar({ ...direccion, [clave]: valor })}
        />
    );

    return (
        <>
            <div className="ancho checkout-fila-via">
                {campo("tipoVia", "Tipo de vía (opcional)")}
                {campo("nombreVia", "Vía", "address-line1")}
            </div>
            {campo("numero", "Número (opcional)")}
            {campo("otros", "Otros (opcional)", "address-line2")}
            {campo("codPostal", "Código postal", "postal-code")}
            {campo("ciudad", "Ciudad", "address-level2")}
            {campo("provincia", "Provincia (opcional)", "address-level1")}
            <AutocompletarTienda
                etiqueta="País"
                valor={direccion.paisId}
                opciones={opcionesPais(paises, direccion.paisId).map((p) => ({ valor: p.id, texto: p.nombre }))}
                obligatorio
                error={errores[`${prefijo}.paisId`]}
                deshabilitado={deshabilitado}
                onCambiar={(paisId) => onCambiar({ ...direccion, paisId })}
            />
        </>
    );
};
