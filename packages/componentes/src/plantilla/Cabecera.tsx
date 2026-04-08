import { FactoryCtx } from "@olula/lib/factory_ctx.tsx";
import { useContext } from "react";
import { Link } from "react-router";
import { QIcono } from "../atomos/qicono.tsx";
import "./Cabecera.css";
import { estaAutentificado } from "./autenticacion";
import { useMenuControl } from "./useMenuControl";

export type CabeceraProps = {
  logoSrc?: string;
  logoAlt?: string;
  logoClassName?: string;
  AccionesCabecera?: () => React.ReactNode;
  MenuUsuario?: () => React.ReactNode;
  ExtraLogo?: () => React.ReactNode;
};

export const CabeceraBase = ({
  logoSrc = "/olula_header_blanco.png",
  logoAlt = "Olula | Inicio",
  AccionesCabecera,
  MenuUsuario,
  ExtraLogo,
}: CabeceraProps) => {
  const { toggleMenu } = useMenuControl();
  const autenticado = estaAutentificado();

  return (
    <>
      <header>
        <button
          id="boton-menu-lateral"
          aria-label="Abrir menú lateral"
          onClick={() => toggleMenu("lateral")}
        ></button>

        <label htmlFor="boton-menu-lateral" id="etiqueta-menu-abierto" />
        <Link to="/">
          <img src={logoSrc} alt={logoAlt} className="logo-app" />
        </Link>
        {ExtraLogo ? <ExtraLogo /> : null}
        <div id="cabecera-acciones-extra">
          {AccionesCabecera ? <AccionesCabecera /> : null}
        </div>
        {autenticado && (
          <>
            <button
              id="boton-menu-usuario"
              aria-label="Abrir menú usuario"
              onClick={() => toggleMenu("usuario")}
            ></button>
            <label
              htmlFor="boton-menu-usuario"
              id="etiqueta-menu-usuario-abierto"
            >
              {MenuUsuario ? (
                <MenuUsuario />
              ) : (
                <QIcono nombre="perfil" tamaño="sm" />
              )}
            </label>
          </>
        )}
      </header>
    </>
  );
};

export const Cabecera = (props: CabeceraProps) => {
  const { app } = useContext(FactoryCtx);
  const CabeceraCustom = app.Componentes?.cabecera as typeof CabeceraBase;
  const AccionesCabecera = app.Componentes
    ?.cabecera_acciones as () => React.ReactNode;
  const MenuUsuario = app.Componentes
    ?.cabecera_menu_usuario as () => React.ReactNode;
  const ExtraLogo = app.Componentes
    ?.cabecera_extra_logo as () => React.ReactNode;

  const cProps: CabeceraProps = {
    ...props,
    AccionesCabecera: AccionesCabecera || props.AccionesCabecera,
    MenuUsuario: MenuUsuario || props.MenuUsuario,
    ExtraLogo: ExtraLogo || props.ExtraLogo,
  };

  return CabeceraCustom ? (
    <CabeceraCustom {...cProps} />
  ) : (
    <CabeceraBase {...cProps} />
  );
};
