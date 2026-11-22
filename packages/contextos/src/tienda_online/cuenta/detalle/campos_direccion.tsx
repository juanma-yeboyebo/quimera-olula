import { AutocompletarTienda } from "../../comun/componentes/autocompletar_tienda.tsx";
import { CampoFormulario } from "../../comun/componentes/campo_formulario.tsx";
import { DireccionRegistro, ErroresRegistro, PaisTienda } from "../diseño.ts";
import { opcionesPais } from "../dominio.ts";

export const CamposDireccionCuenta = ({
    direccion,
    paises,
    errores,
    deshabilitado,
    onCambiar,
}: {
    direccion: DireccionRegistro;
    paises: PaisTienda[];
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
            <AutocompletarTienda
                etiqueta="País"
                valor={direccion.paisId}
                opciones={opcionesPais(paises, direccion.paisId).map((p) => ({ valor: p.id, texto: p.nombre }))}
                error={errores["direccion.paisId"]}
                deshabilitado={deshabilitado}
                onCambiar={(paisId) => onCambiar({ ...direccion, paisId })}
            />
        </>
    );
};
