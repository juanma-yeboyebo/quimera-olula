import { Box, QBox, Typography } from "@quimera/comps";
import { Avatar, List, ListItem, ListItemSecondaryAction, ListItemText } from "@quimera/thirdparty";
import Quimera, { PropValidation, useStateValue, useWidth, util } from "quimera";
import React from "react";

function TesoreriaDetalle({ useStyles }) {
  const [{ recibosDetalle, fechaCurrent }, dispatch] = useStateValue();
  const classes = useStyles();

  const width = useWidth();

  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;
  const desktop = !mobile;

  const avatar = {
    reciboscli: "C",
    recibosprov: "P",
    tesomanual: "M",
  };

  return (
    <Quimera.Template id="Detalle">
      {fechaCurrent && (
        <Box width={anchoDetalle} mx={desktop ? 1 : 0}>
          <QBox
            titulo={`Recibos. ${util.formatDate(fechaCurrent)}`}
            botonesCabecera={mobile && [{ id: "atras", icon: "arrow_back", disabled: false }]}
          >
            <Box px={1}>
              <Box width={1} border={0} borderColor="gray" height={"calc(100%)"}>
                <List>
                  {recibosDetalle.map(recibo => (
                    <ListItem key={recibo.idrecibo} divider={true}>
                      <Avatar
                        className={
                          recibo.importerecibo < 0
                            ? classes.pago
                            : recibo.importerecibo > 0
                            ? classes.cobro
                            : classes.manual
                        }
                      >
                        {avatar[recibo.tabla]}
                      </Avatar>
                      <ListItemText
                        primary={
                          <Typography>
                            <strong>{recibo.codigo}</strong>
                          </Typography>
                        }
                        secondary={
                          <Typography>
                            {!recibo.nombre ? recibo.concepto : recibo.nombre}
                          </Typography>
                        }
                      ></ListItemText>
                      <ListItemSecondaryAction>
                        <strong
                          className={recibo.importerecibo >= 0 ? classes.verde : classes.rojo}
                        >
                          {` ${util.euros(recibo.importerecibo)}`}
                        </strong>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          </QBox>
        </Box>
      )}
    </Quimera.Template>
  );
}

export default TesoreriaDetalle;
