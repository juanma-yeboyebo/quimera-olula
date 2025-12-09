import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QCheckbox } from "@olula/componentes/atomos/qcheckbox.tsx";
import { QForm } from "@olula/componentes/atomos/qform.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { useState } from "react";
import { useNavigate } from "react-router";
import { login } from "../dominio.ts";
import { misPermisos, permisosGrupo } from "../infraestructura.ts";
import estilos from "./Login.module.css";

export const Login = () => {
  const navigate = useNavigate();

  const [mostrarContraseña, setMostrarContraseña] = useState(false);

  const loginSubmit = async (datos: Record<string, string>) => {
    const { id, contraseña } = datos;

    return login(id, contraseña)
      .then(() => {
        misPermisos().then((datosPermisos) => {
          permisosGrupo.actualizar(datosPermisos.datos);
        });
      })
      .then(() => navigate("/"));
  };

  return (
    <section className={estilos.login}>
      <div className="title">
        <h1>Iniciar sesión</h1>
      </div>
      <div className={estilos.loginForm}>
        <QForm onSubmit={loginSubmit}>
          <QInput label="Email" nombre="id" tipo="email" />
          <QInput
            label="Contraseña"
            nombre="contraseña"
            tipo={mostrarContraseña ? "texto" : "contraseña"}
          />
          <QCheckbox
            label="Mostrar contraseña"
            nombre=""
            valor={mostrarContraseña}
            onChange={(valor) => setMostrarContraseña(valor === "true")}
            opcional={true}
          />
          <QBoton tipo="submit" tamaño="mediano">
            Iniciar sesión
          </QBoton>
        </QForm>
      </div>
    </section>
  );
};
