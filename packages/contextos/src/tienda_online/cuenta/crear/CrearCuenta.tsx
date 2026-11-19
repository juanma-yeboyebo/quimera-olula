import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { BotonTienda } from "../../comun/componentes/boton_tienda.tsx";
import { CampoFormulario } from "../../comun/componentes/campo_formulario.tsx";
import { ConStoreView } from "../../comun/componentes/con_storeview.tsx";
import "../CuentaTienda.css";
import { DatosRegistro, DireccionRegistro } from "../diseño.ts";
import { campoRegistroValido, datosRegistroIniciales } from "../dominio.ts";
import { contextoRegistroInicial } from "./crear.ts";
import { getMaquina } from "./maquina.ts";

const FormularioRegistro = () => {
    const navigate = useNavigate();
    const { ctx, emitir } = useMaquina(
        getMaquina,
        contextoRegistroInicial(datosRegistroIniciales()),
    );
    const { estado, datos, errores, tocados, error, emailRepetido } = ctx;
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

    const obligatorio = (campo: string) => ({
        obligatorio: true,
        error: errores[campo],
        valido: campoRegistroValido(campo, tocados, errores),
        onSalir: () => emitir("campo_tocado", campo),
    });

    const cambiarDireccion = (cambio: Partial<DireccionRegistro>) =>
        cambiar({ direccion: { ...datos.direccion, ...cambio } });

    return (
        <div className="CuentaTienda">
            <div className="cuenta-contenedor contenedor-tienda">
                <form
                    className="cuenta-tarjeta cuenta-estrecha cuenta-ancha"
                    noValidate
                    onSubmit={(e) => {
                        e.preventDefault();
                        crear();
                    }}
                >
                    <h1>Crear cuenta</h1>
                    <p className="cuenta-nota">Los campos con * son obligatorios</p>
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
                    <fieldset>
                        <legend>Datos</legend>
                        <div className="ancho">
                            <CampoFormulario
                                etiqueta="Email"
                                tipo="email"
                                autocompletar="email"
                                valor={datos.email}
                                {...obligatorio("email")}
                                deshabilitado={ocupado}
                                onCambiar={(email) => cambiar({ email })}
                            />
                        </div>
                        <CampoFormulario
                            etiqueta="Contraseña"
                            tipo="password"
                            autocompletar="new-password"
                            valor={datos.password}
                            {...obligatorio("password")}
                            deshabilitado={ocupado}
                            onCambiar={(password) => cambiar({ password })}
                        />
                        <CampoFormulario
                            etiqueta="Repetir contraseña"
                            tipo="password"
                            autocompletar="new-password"
                            valor={datos.repetirPassword}
                            {...obligatorio("repetirPassword")}
                            deshabilitado={ocupado}
                            onCambiar={(repetirPassword) => cambiar({ repetirPassword })}
                        />
                        <div className="ancho">
                            <CampoFormulario
                                etiqueta="Nombre"
                                autocompletar="name"
                                valor={datos.nombre}
                                {...obligatorio("nombre")}
                                deshabilitado={ocupado}
                                onCambiar={(nombre) => cambiar({ nombre })}
                            />
                        </div>
                        <CampoFormulario
                            etiqueta="NIF/CIF"
                            valor={datos.idFiscal}
                            {...obligatorio("idFiscal")}
                            deshabilitado={ocupado}
                            onCambiar={(idFiscal) => cambiar({ idFiscal })}
                        />
                        <CampoFormulario
                            etiqueta="Teléfono"
                            tipo="tel"
                            autocompletar="tel"
                            valor={datos.telefono}
                            deshabilitado={ocupado}
                            onCambiar={(telefono) => cambiar({ telefono })}
                        />
                    </fieldset>
                    <fieldset>
                        <legend>Dirección</legend>
                        <div className="ancho">
                            <CampoFormulario
                                etiqueta="Vía"
                                autocompletar="address-line1"
                                valor={datos.direccion.nombreVia}
                                {...obligatorio("direccion.nombreVia")}
                                deshabilitado={ocupado}
                                onCambiar={(nombreVia) => cambiarDireccion({ nombreVia })}
                            />
                        </div>
                        <CampoFormulario
                            etiqueta="Número"
                            valor={datos.direccion.numero}
                            deshabilitado={ocupado}
                            onCambiar={(numero) => cambiarDireccion({ numero })}
                        />
                        <CampoFormulario
                            etiqueta="Código postal"
                            autocompletar="postal-code"
                            valor={datos.direccion.codPostal}
                            {...obligatorio("direccion.codPostal")}
                            deshabilitado={ocupado}
                            onCambiar={(codPostal) => cambiarDireccion({ codPostal })}
                        />
                        <CampoFormulario
                            etiqueta="Ciudad"
                            autocompletar="address-level2"
                            valor={datos.direccion.ciudad}
                            {...obligatorio("direccion.ciudad")}
                            deshabilitado={ocupado}
                            onCambiar={(ciudad) => cambiarDireccion({ ciudad })}
                        />
                        <CampoFormulario
                            etiqueta="Provincia"
                            autocompletar="address-level1"
                            valor={datos.direccion.provincia}
                            deshabilitado={ocupado}
                            onCambiar={(provincia) => cambiarDireccion({ provincia })}
                        />
                        <CampoFormulario
                            etiqueta="País"
                            autocompletar="country"
                            valor={datos.direccion.paisId}
                            {...obligatorio("direccion.paisId")}
                            deshabilitado={ocupado}
                            onCambiar={(paisId) => cambiarDireccion({ paisId })}
                        />
                    </fieldset>
                    <BotonTienda tipo="submit" ancho deshabilitado={ocupado}>
                        Crear cuenta
                    </BotonTienda>
                    <p className="cuenta-alterna">
                        ¿Ya tienes cuenta? <Link to="/login">Entrar</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export const CrearCuenta = () => (
    <ConStoreView>{() => <FormularioRegistro />}</ConStoreView>
);
