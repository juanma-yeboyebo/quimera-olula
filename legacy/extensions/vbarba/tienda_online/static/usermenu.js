import { util } from "quimera";

export default parent => ({
  ...parent,
  user: {
    title: "Usuario",
    items: {
      username: {
        title: (user) => user.user || "Mi usuario",
        icons: ["person", "no_icon"],
        color: "success",
        variant: "main",
        //url: "#",
        url: "areaclientes",
      },
    },
  },
});