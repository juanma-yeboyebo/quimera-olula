import { Box, Icon, QBox, Typography } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth, util } from "quimera";
import { useEffect } from "react";

function User({ idUser }) {
  const [{ users }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: "onIdUsersProp",
      payload: { id: idUser ?? "" },
    });
  }, [dispatch, idUser]);

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
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default User;
