import { Box, QBox, QListModel, Typography } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import React from "react";

import { ListItemMisFacturas } from "../../../comps";

function FacturasMaster({ useStyles }) {
  const [{ facturas }, dispatch] = useStateValue();
  // const classes = useStyles()

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;

  return (
    <Quimera.Template id="FacturasMaster">
      <Box width={anchoDetalle} >
        <QBox titulo="Mis facturas">
          {facturas.idList.length > 0 ? (
            <QListModel data={facturas} modelName="facturas" ItemComponent={ListItemMisFacturas}
              scrollable={true} altoCabecera={160} />
          ) : (
            <Typography variant="h5">
              No hay facturas
            </Typography>
          )}
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default FacturasMaster;
