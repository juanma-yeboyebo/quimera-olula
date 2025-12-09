import { Hidden, Paper } from "@quimera/comps";
import { Box } from "@quimera/thirdparty";
import Quimera, { PropValidation, useStateValue } from "quimera";
import React, { useEffect } from "react";

function DashboardCobros({ useStyles }) {
  const [, dispatch] = useStateValue();
  const classes = useStyles();

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, [dispatch]);

  return (
    <Quimera.Template id="ViewTemplate">
      <br />
      <br />
      <Box mx={1}>
        <Box className={classes.loading} visibility="hidden"></Box>
        <Quimera.SubView id="DashboardCobros/DashboardFiltro" />
        <br />
        <Hidden mdUp>
          <Quimera.SubView id="DashboardCobros/GraficosCobros" />
        </Hidden>
        <Hidden smDown>
          <Box my={1}>
            <Paper>
              <Box p={1}>
                <Quimera.SubView id="DashboardCobros/GraficosCobros" />
              </Box>
            </Paper>
          </Box>
        </Hidden>
      </Box>
    </Quimera.Template>
  );
}

export default DashboardCobros;
