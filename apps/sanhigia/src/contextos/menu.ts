import { MenuUsuarioElementos } from "@olula/componentes/menu/menu-usuario.tsx";

/**
 * Elementos del menú de usuario personalizados para Sanhigia
 * Nota: El nombre del usuario se actualiza dinámicamente en el componente
 */
export const menuUsuarioSanhigia: MenuUsuarioElementos = [
    {
        nombre: "Usuario",
        subelementos: [
            {
                nombre: "Mi usuario",
                icono: "user",
                url: "/user",
                color: "success",
                variant: "main",
            },
        ],
    },
    {
        nombre: "Administración",
        subelementos: [
            {
                nombre: "Usuarios",
                icono: "lista",
                url: "/users",
                // regla: "Users:visit",
            },
            {
                nombre: "Grupos",
                icono: "group",
                url: "/groups",
                // regla: "Groups:visit",
            },
        ],
    },
    {
        nombre: "Sesión",
        subelementos: [
            {
                nombre: "Desconectar",
                icono: "exit",
                url: "/logout",
            },
        ],
    },
];
