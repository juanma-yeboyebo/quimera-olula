import { BotonIcono } from "../componentes/boton_icono.tsx";
import { AccionesCabeceraTienda } from "../componentes/acciones_cabecera_tienda.tsx";
import { useHueco } from "./usar_hueco.ts";
import { BuscadorTienda } from "./buscador_tienda.tsx";
import { LogoTienda } from "./logo_tienda.tsx";
import { MenuCategoriasTienda } from "./menu_categorias_tienda.tsx";
import "./cabecera_tienda.css";

export const CabeceraTienda = () => {
    const Logo = useHueco("cabecera_logo", LogoTienda);
    const Buscador = useHueco("cabecera_buscador", BuscadorTienda);
    const Acciones = useHueco("cabecera_acciones", AccionesCabeceraTienda);
    const Menu = useHueco("menu_categorias", MenuCategoriasTienda);

    return (
        <header className="cabecera-tienda">
            <div className="cabecera-tienda-fila">
                <div className="cabecera-tienda-menu">
                    <BotonIcono icono="menu" etiqueta="Abrir menú" a="/catalogo" />
                </div>
                <div className="cabecera-tienda-logo">
                    <Logo />
                </div>
                <div className="cabecera-tienda-buscador">
                    <Buscador />
                </div>
                <div className="cabecera-tienda-acciones">
                    <Acciones />
                </div>
            </div>
            <div className="cabecera-tienda-categorias">
                <div className="cabecera-tienda-contenedor">
                    <Menu />
                </div>
            </div>
        </header>
    );
};
