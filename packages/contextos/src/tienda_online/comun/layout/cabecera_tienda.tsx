import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BotonIcono } from "../componentes/boton_icono.tsx";
import { AccionesCabeceraTienda } from "../componentes/acciones_cabecera_tienda.tsx";
import { ContextoMenuMovil } from "./contexto_menu_movil.ts";
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

    const [abierto, setAbierto] = useState(false);
    const botonMenu = useRef<HTMLDivElement>(null);
    const abrir = useCallback(() => setAbierto(true), []);
    const cerrar = useCallback(() => {
        setAbierto(false);
        botonMenu.current?.querySelector("button")?.focus();
    }, []);
    const cabecera = useRef<HTMLElement>(null);

    useEffect(() => {
        const el = cabecera.current;
        if (!el) return;
        const raiz = document.documentElement;
        const medir = () => raiz.style.setProperty("--tienda-alto-cabecera", `${el.offsetHeight}px`);
        medir();
        const observador = new ResizeObserver(medir);
        observador.observe(el);
        return () => {
            observador.disconnect();
            raiz.style.removeProperty("--tienda-alto-cabecera");
        };
    }, []);

    const menuMovil = useMemo(() => ({ abierto, abrir, cerrar }), [abierto, abrir, cerrar]);

    return (
        <ContextoMenuMovil.Provider value={menuMovil}>
        <header className="cabecera-tienda" ref={cabecera}>
            <div className="cabecera-tienda-fila">
                <div className="cabecera-tienda-menu" ref={botonMenu}>
                    <BotonIcono icono="menu" etiqueta="Abrir menú" onClick={abrir} />
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
        </ContextoMenuMovil.Provider>
    );
};
