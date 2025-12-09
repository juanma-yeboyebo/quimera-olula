import { Box, QBox, QListModel, Typography } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import React from "react";

import { ListItemMisAlbaranes } from "../../../comps";

function AlbaranesMaster({ useStyles }) {
  const [{ albaranes }, dispatch] = useStateValue();
  // const classes = useStyles()

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;

  return (
    <Quimera.Template id="AlbaranesMaster">
      <Box width={anchoDetalle} >
        <QBox titulo="Mis albaranes">
          {albaranes.idList.length > 0 ? (
            <QListModel data={albaranes} modelName="albaranes" ItemComponent={ListItemMisAlbaranes} scrollable={true} altoCabecera={160} />
          ) : (
            <Typography variant="h5">
              No hay albaranes
            </Typography>
          )}
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default AlbaranesMaster;
