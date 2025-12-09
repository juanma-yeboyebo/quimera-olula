import { Box, Button, Icon, QBox, Typography } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth, util } from "quimera";
import { useEffect } from "react";

function User({ idUser }) {
  const [{ tengoCredenciales }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, [dispatch]);

  const width = useWidth();

  const mobile = ["xs", "sm"].includes(width);
  const desktop = !mobile;
  const anchoDetalle = mobile ? 1 : 0.5;

  const botones = [
    // {
    //   id: "nuevoUsuario",
    //   icon: "add_circle",
    //   text: "Nuevo Usuario",
    // },
  ];

  const textoPermisosGoogleApi = !tengoCredenciales
    ? "Dar permisos a esta aplicación para gestionar tu google calendar"
    : "Renovar permisos para gestionar tu google calendar";

  return (
    <Quimera.Template id="User">
      <Box mx={desktop ? 0.5 : 0}>
        <QBox titulo="Usuario" botones={botones}>
          <Box display="flex" alignItems="center" m={1}>
            <Icon color="action" fontSize="default" style={{ marginRight: "5px" }}>
              person
            </Icon>
            <Typography variant="h5">{util.getUser().nombre}</Typography>
          </Box>
          <Box display="flex" alignItems="center" m={1}>
            <Icon color="action" fontSize="default" style={{ marginRight: "5px" }}>
              group
            </Icon>
            <Typography variant="h5">{util.getUser().group}</Typography>
          </Box>
          <Box
            display={"flex"}
            justifyContent={"flex-start"}
            flexDirection={"column"}
            style={{ gap: "10px" }}
          >
            {tengoCredenciales && (
              <Typography variant="body2" align="center" style={{ marginRight: "10px" }}>
                {
                  "Ahora tus tareas se sincronizarán con tu calendario de Google Calendar. Puede revocar los permisos concedidos a está aplicación desde "
                }
                <a href="https://myaccount.google.com/connections?hl=es">
                  https://myaccount.google.com/connections?hl=es
                </a>
              </Typography>
            )}
            <Button id="activarGoogleCalendar" text={textoPermisosGoogleApi} variant="outlined" />
          </Box>
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default User;
