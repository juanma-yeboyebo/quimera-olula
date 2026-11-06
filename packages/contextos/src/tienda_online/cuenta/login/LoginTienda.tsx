import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { CampoFormulario } from "../../checkout/detalle/campo_formulario.tsx";
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
        <form
            className="CuentaTienda"
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
                valor={email}
                deshabilitado={ocupado}
                onCambiar={setEmail}
            />
            <CampoFormulario
                etiqueta="Contraseña"
                tipo="password"
                valor={contraseña}
                deshabilitado={ocupado}
                onCambiar={setContraseña}
            />
            <div className="cuenta-botones">
                <button type="submit" disabled={ocupado}>
                    Entrar
                </button>
                <Link to="/registro">Crear cuenta</Link>
            </div>
        </form>
    );
};

export const LoginTienda = () => (
    <ConStoreView>{() => <FormularioLogin />}</ConStoreView>
);
