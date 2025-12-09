import { Box, Icon, IconButton } from "@quimera/comps";
import Quimera, { useStateValue, useWidth } from "quimera";
import { useEffect } from "react";

function ComerciosCampana({ idCampana, useStyles }) {
  const [{ comercios }, dispatch] = useStateValue();
  const classes = useStyles();
  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: {
        idCampana,
      },
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: "oniDCampanaProp",
      payload: { id: idCampana ? parseInt(idCampana) : "" },
    });
  }, [idCampana]);

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const desktop = !mobile;
  const masterVisible = true;
  const detalleVisible = true;

  return (
    <Quimera.Template id="ComerciosCampana">
      {idCampana && (
        <Box mx={desktop ? 0.5 : 0}>
          <Box width={1} display="flex">
            <Box>
              <IconButton
                id="VolverCampanas"
                // key={b.id}
                fontSize="large"
                title="Volver"
              >
                <Icon fontSize="large" className={classes.iconoCabecera}>
                  arrow_back
                </Icon>
              </IconButton>
            </Box>
            {masterVisible && (
              <Quimera.SubView id="ComerciosCampana/ComerciosCampanaMaster" idCampana={idCampana} />
            )}
            {detalleVisible && (
              <Quimera.SubView id="ComerciosCampana/ComerciosCampanaDetail" idCampana={idCampana} />
            )}
          </Box>
        </Box>
      )}
    </Quimera.Template>
  );
}

export default ComerciosCampana;
