import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { getCategorias } from "../../catalogo/infraestructura.ts";
import { CategoriaTienda } from "../../catalogo/diseño.ts";
import "./menu_categorias_tienda.css";

export const MenuCategoriasTienda = () => {
    const [categorias, setCategorias] = useState<CategoriaTienda[]>([]);

    useEffect(() => {
        getCategorias().then(setCategorias).catch(() => setCategorias([]));
    }, []);

    return (
        <nav className="menu-categorias-tienda" aria-label="Categorías">
            {categorias.map((c) => (
                <NavLink key={c.id} to={`/categoria/${c.slug}`}>
                    {c.nombre}
                </NavLink>
            ))}
        </nav>
    );
};
