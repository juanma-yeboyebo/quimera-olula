import { MenuUsuarioElementos, ProcesoElementosFn } from "@olula/componentes/menu/menu-usuario.tsx";
import util from "quimera/util.js";

/**
 * Función que procesa los elementos del menú de usuario para Sanhigia
 * Inyecta dinámicamente el nombre del usuario autenticado
 */
export const procesarElementosSanhigia: ProcesoElementosFn = (
    elementos: MenuUsuarioElementos
) => {
    const usuario = util.getUser();
    const nombreUsuario = usuario?.user || "Mi usuario";

    return elementos.map((elemento) => {
        // Busca la sección de Usuario y reemplaza el nombre
        if (elemento.nombre === "Usuario" && "subelementos" in elemento) {
            return {
                ...elemento,
                subelementos: elemento.subelementos.map((sub) => {
                    if (sub.nombre === "Mi usuario") {
                        return { ...sub, nombre: nombreUsuario };
                    }
                    return sub;
                }),
            };
        }
        return elemento;
    });
};
