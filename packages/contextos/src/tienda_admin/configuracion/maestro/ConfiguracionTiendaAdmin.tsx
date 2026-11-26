import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Usuario } from "#/comun/componentes/usuario.tsx";
import { AgenteTpv } from "#/tpv/comun/componentes/AgenteTpv.tsx";
import { PuntoVentaTpv } from "#/tpv/comun/componentes/PuntoVentaTpv.tsx";
import { SelectorWebsite } from "../../comun/componentes/SelectorWebsite.tsx";
import { useWebsiteActivo } from "../../comun/website_store.ts";
import { WebsiteConfiguracion } from "../diseño.ts";
import {
    cambiosDeEdicion,
    edicionDeWebsite,
    metaEdicionConfiguracion,
    seccionesProximamente,
    TEXTO_CONFIGURACION_PROXIMAMENTE,
} from "../dominio.ts";
import { getWebsiteConfiguracion, patchWebsiteConfiguracion } from "../infraestructura.ts";
import "./ConfiguracionTiendaAdmin.css";

const FormularioWebsite = ({
    website,
    onGuardado,
}: {
    website: WebsiteConfiguracion;
    onGuardado: () => Promise<void>;
}) => {
    const { intentar } = useContext(ContextoError);
    const inicial = useMemo(() => edicionDeWebsite(website), [website]);
    const { modelo, uiProps, modificado } = useModelo(metaEdicionConfiguracion, inicial);

    const guardar = async () => {
        const ok = await intentar(() => patchWebsiteConfiguracion(website.id, cambiosDeEdicion(modelo)))
            .then(() => true)
            .catch(() => false);
        if (ok) await onGuardado();
    };

    return (
        <>
            <section className="ConfiguracionTiendaAdmin-seccion">
                <h3>Datos de la tienda</h3>
                <quimera-formulario>
                    <QInput label="Código" nombre="codigo" valor={website.codigo} soloLectura />
                    <QInput label="Nombre" nombre="nombre" valor={website.nombre} soloLectura />
                </quimera-formulario>
            </section>
            <section className="ConfiguracionTiendaAdmin-seccion">
                <h3>Ventas en tienda (TPV)</h3>
                <quimera-formulario>
                    <PuntoVentaTpv {...uiProps("tpvPuntoVentaId")} />
                    <AgenteTpv {...uiProps("tpvAgenteId")} />
                </quimera-formulario>
            </section>
            <section className="ConfiguracionTiendaAdmin-seccion">
                <h3>Notificaciones</h3>
                <quimera-formulario>
                    <Usuario {...uiProps("usuarioNotificacionesId", "nombreUsuarioNotificaciones")} />
                </quimera-formulario>
            </section>
            <div className="botones maestro-botones">
                <QBoton onClick={guardar} deshabilitado={!modificado}>
                    Guardar
                </QBoton>
            </div>
        </>
    );
};

export const ConfiguracionTiendaAdmin = () => {
    const websiteId = useWebsiteActivo();
    const { intentar } = useContext(ContextoError);
    const [website, setWebsite] = useState<WebsiteConfiguracion | null>(null);

    const cargar = useCallback(async () => {
        if (websiteId === null) return setWebsite(null);
        const leido = await intentar(() => getWebsiteConfiguracion(websiteId)).catch(() => null);
        setWebsite(leido);
    }, [websiteId, intentar]);

    useEffect(() => {
        void cargar();
    }, [cargar]);

    return (
        <div className="ConfiguracionTiendaAdmin">
            <h2>Configuración de la tienda</h2>
            <SelectorWebsite />
            {website && <FormularioWebsite key={website.id} website={website} onGuardado={cargar} />}
            {seccionesProximamente.map((seccion) => (
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
};
