import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { CampoFormulario } from "../../checkout/detalle/campo_formulario.tsx";
import { ConStoreView } from "../../comun/componentes/con_storeview.tsx";
import "../CuentaTienda.css";
import { DatosRegistro, DireccionRegistro } from "../diseño.ts";
import { datosRegistroIniciales } from "../dominio.ts";
import { contextoRegistroInicial } from "./crear.ts";
import { getMaquina } from "./maquina.ts";

const FormularioRegistro = () => {
    const navigate = useNavigate();
    const { ctx, emitir } = useMaquina(
        getMaquina,
        contextoRegistroInicial(datosRegistroIniciales()),
    );
    const { estado, datos, errores, error, emailRepetido } = ctx;
    const enCurso = useRef(false);
    const [bloqueado, setBloqueado] = useState(false);
    const ocupado = bloqueado || estado !== "EDITANDO";

    const crear = async () => {
        if (enCurso.current) return;
        enCurso.current = true;
        setBloqueado(true);
        try {
            await emitir("crear");
        } finally {
            enCurso.current = false;
            setBloqueado(false);
        }
    };

    useEffect(() => {
        if (estado === "REGISTRADO") navigate("/mi-cuenta", { replace: true });
        if (estado === "REGISTRADO_SIN_SESION") navigate("/login", { replace: true });
    }, [estado, navigate]);

    const cambiar = (cambio: Partial<DatosRegistro>) =>
        emitir("datos_cambiados", { ...datos, ...cambio });

    const cambiarDireccion = (cambio: Partial<DireccionRegistro>) =>
        cambiar({ direccion: { ...datos.direccion, ...cambio } });

    return (
        <form
            className="CuentaTienda"
            noValidate
            onSubmit={(e) => {
                e.preventDefault();
                crear();
            }}
        >
            <h1>Crear cuenta</h1>
            {emailRepetido && (
                <p role="alert" className="cuenta-error">
                    Ya existe una cuenta con ese email. <Link to="/login">Iniciar sesión</Link>
                </p>
            )}
            {error && (
                <p role="alert" className="cuenta-error">
                    {error}
                </p>
            )}
            <CampoFormulario
                etiqueta="Email"
                tipo="email"
                valor={datos.email}
                error={errores.email}
                deshabilitado={ocupado}
                onCambiar={(email) => cambiar({ email })}
            />
            <CampoFormulario
                etiqueta="Contraseña"
                tipo="password"
                valor={datos.password}
                error={errores.password}
                deshabilitado={ocupado}
                onCambiar={(password) => cambiar({ password })}
            />
            <CampoFormulario
                etiqueta="Repetir contraseña"
                tipo="password"
                valor={datos.repetirPassword}
                error={errores.repetirPassword}
                deshabilitado={ocupado}
                onCambiar={(repetirPassword) => cambiar({ repetirPassword })}
            />
            <CampoFormulario
                etiqueta="Nombre"
                valor={datos.nombre}
                error={errores.nombre}
                deshabilitado={ocupado}
                onCambiar={(nombre) => cambiar({ nombre })}
            />
            <CampoFormulario
                etiqueta="NIF/CIF"
                valor={datos.idFiscal}
                error={errores.idFiscal}
                deshabilitado={ocupado}
                onCambiar={(idFiscal) => cambiar({ idFiscal })}
            />
            <CampoFormulario
                etiqueta="Teléfono (opcional)"
                tipo="tel"
                valor={datos.telefono}
                deshabilitado={ocupado}
                onCambiar={(telefono) => cambiar({ telefono })}
            />
            <fieldset>
                <legend>Dirección</legend>
                <div className="cuenta-direccion">
                    <CampoFormulario
                        etiqueta="Vía"
                        valor={datos.direccion.nombreVia}
                        error={errores["direccion.nombreVia"]}
                        deshabilitado={ocupado}
                        onCambiar={(nombreVia) => cambiarDireccion({ nombreVia })}
                    />
                    <CampoFormulario
                        etiqueta="Número"
                        valor={datos.direccion.numero}
                        deshabilitado={ocupado}
                        onCambiar={(numero) => cambiarDireccion({ numero })}
                    />
                    <CampoFormulario
                        etiqueta="Código postal"
                        valor={datos.direccion.codPostal}
                        error={errores["direccion.codPostal"]}
                        deshabilitado={ocupado}
                        onCambiar={(codPostal) => cambiarDireccion({ codPostal })}
                    />
                    <CampoFormulario
                        etiqueta="Ciudad"
                        valor={datos.direccion.ciudad}
                        error={errores["direccion.ciudad"]}
                        deshabilitado={ocupado}
                        onCambiar={(ciudad) => cambiarDireccion({ ciudad })}
                    />
                    <CampoFormulario
                        etiqueta="Provincia"
                        valor={datos.direccion.provincia}
                        deshabilitado={ocupado}
                        onCambiar={(provincia) => cambiarDireccion({ provincia })}
                    />
                    <CampoFormulario
                        etiqueta="País"
                        valor={datos.direccion.paisId}
                        error={errores["direccion.paisId"]}
                        deshabilitado={ocupado}
                        onCambiar={(paisId) => cambiarDireccion({ paisId })}
                    />
                </div>
            </fieldset>
            <div className="cuenta-botones">
                <button type="submit" disabled={ocupado}>
                    Crear cuenta
                </button>
                <Link to="/login">Ya tengo cuenta</Link>
            </div>
        </form>
    );
};

export const CrearCuenta = () => (
    <ConStoreView>{() => <FormularioRegistro />}</ConStoreView>
);
