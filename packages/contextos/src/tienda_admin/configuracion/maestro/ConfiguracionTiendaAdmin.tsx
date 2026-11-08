import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import "./ConfiguracionTiendaAdmin.css";

export const TEXTO_CONFIGURACION_PROXIMAMENTE = "Disponible próximamente";

export const seccionesConfiguracion: { titulo: string; campos: string[] }[] = [
    { titulo: "Datos de la tienda", campos: ["Nombre", "Dominio", "Divisa"] },
    { titulo: "Envío gratis", campos: ["Importe mínimo"] },
    { titulo: "Aviso superior", campos: ["Texto del aviso"] },
    { titulo: "Menú", campos: ["Máximo en la barra", "En la barra con «Todas las categorías»"] },
];

export const ConfiguracionTiendaAdmin = () => (
    <div className="ConfiguracionTiendaAdmin">
        <h2>Configuración de la tienda</h2>
        {seccionesConfiguracion.map((seccion) => (
            <section key={seccion.titulo} className="ConfiguracionTiendaAdmin-seccion">
                <h3>{seccion.titulo}</h3>
                <p className="ConfiguracionTiendaAdmin-aviso">{TEXTO_CONFIGURACION_PROXIMAMENTE}</p>
                <quimera-formulario>
                    {seccion.campos.map((campo) => (
                        <QInput
                            key={campo}
                            label={campo}
                            nombre={`${seccion.titulo}-${campo}`}
                            valor=""
                            deshabilitado
                        />
                    ))}
                </quimera-formulario>
            </section>
        ))}
    </div>
);
