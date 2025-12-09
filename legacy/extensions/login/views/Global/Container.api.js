import { util } from "quimera";

export default parent =>
  class loginApi extends parent {
    bunch = {
      onLogout: [
        {
          type: "function",
          function: () => {
            util.setGlobalSetting("user", null);
            for (let i = 0; i < window.localStorage.length; i++) {
              /// QUITAR EN PRODUCCION, AHORA ES COMPATIBLE Y DIFERENCIA USUARIOS
              if (window.localStorage.key(i).includes("filtro")) {
                window.localStorage.removeItem(window.localStorage.key(i));
              }
            }
            window.location.reload();
          },
        },
      ],
    };
  };
