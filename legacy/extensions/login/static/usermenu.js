export default parent => ({
  ...parent,
  user: {
    title: "Usuario",
    items: {
      username: {
        title: user => user.user || "Mi usuario",
        icons: ["person", "no_icon"],
        color: "success",
        variant: "main",
        url: "/user",
      },
    },
  },
  admin: {
    title: "Administración",
    items: {
      users: {
        title: "Usuarios",
        icons: ["people"],
        rule: "Users:visit",
        url: "/users",
      },
      groups: {
        title: "Grupos",
        icons: ["groups"],
        rule: "Groups:visit",
        url: "/groups",
      },
    },
  },
  session: {
    title: "Sesión",
    items: {
      logout: {
        title: "Desconectar",
        icons: ["exit_to_app"],
        url: "/logout",
      },
    },
  },
});
