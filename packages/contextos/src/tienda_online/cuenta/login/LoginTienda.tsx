import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { BotonTienda } from "../../comun/componentes/boton_tienda.tsx";
import { CampoFormulario } from "../../comun/componentes/campo_formulario.tsx";
import { ConStoreView } from "../../comun/componentes/con_storeview.tsx";
import "../CuentaTienda.css";
import { iniciarSesion } from "../sesion.ts";

const FormularioLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [error, setError] = useState(false);
    const [ocupado, setOcupado] = useState(false);

    const entrar = async () => {
        setOcupado(true);
        setError(false);
        const correcto = await iniciarSesion(email, contraseña);
        if (correcto) {
            navigate("/");
            return;
        }
        setError(true);
        setOcupado(false);
    };

    return (
        <div className="CuentaTienda">
            <div className="cuenta-contenedor contenedor-tienda">
                <form
                    className="cuenta-tarjeta cuenta-estrecha"
                    noValidate
                    onSubmit={(e) => {
                        e.preventDefault();
                        entrar();
                    }}
                >
                    <h1>Iniciar sesión</h1>
                    {error && (
                        <p role="alert" className="cuenta-error">
                            Email o contraseña incorrectos
                        </p>
                    )}
                    <CampoFormulario
                        etiqueta="Email"
                        tipo="email"
                        autocompletar="username"
                        valor={email}
                        deshabilitado={ocupado}
                        onCambiar={setEmail}
                    />
                    <CampoFormulario
                        etiqueta="Contraseña"
                        tipo="password"
                        autocompletar="current-password"
                        valor={contraseña}
                        deshabilitado={ocupado}
                        onCambiar={setContraseña}
                    />
                    <BotonTienda tipo="submit" ancho deshabilitado={ocupado}>
                        Entrar
                    </BotonTienda>
                    <p className="cuenta-alterna">
                        ¿No tienes cuenta? <Link to="/registro">Crear cuenta</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export const LoginTienda = () => (
    <ConStoreView>{() => <FormularioLogin />}</ConStoreView>
);
