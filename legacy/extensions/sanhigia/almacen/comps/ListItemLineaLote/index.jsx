import { Column, Table } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import {
  Checkbox,
  FormControlLabel
} from "@quimera/thirdparty";
import React, { useState } from "react";
import Quimera, { useStateValue, useWidth } from "quimera";

const useStyles = makeStyles(theme => ({

}));

function ListItemLineaLote({ disabled, dispatch, lineas, hideSecondary = false, selected = false, ...props }) {
  const classes = useStyles();
  const [{ selectedLote }] = useStateValue();
  // console.log("selectedItem", selectedLote);

  return (
    <Table id="tdbClientes"
      data={lineas}
      orderColumn="codlote"
    >
      <Column.Action
        id="marcarLote"
        width={35}
        value={linea => (
          <FormControlLabel
            style={{ margin: "0px", padding: "0px" }}
            labelPlacement="start"
            control={
              <Checkbox
                color="default"
                checked={linea.codlote === selectedLote ? true : false}
                onClick={() =>
                  dispatch({
                    type: "onLotesItemSelected",
                    payload: { item: linea.codlote }
                  })
                }
              />
            }
          />
        )}
      />
      <Column.Text
        id="codlote"
        header="Código Lote"
        orderColumn="codlote"
        value={lote => lote.codigo}
        width={200}
      />
      <Column.Text
        id="enalmacen"
        header="Disponible"
        value={lote => lote.enalmacen}
        width={80}
      />
      <Column.Date
        id="caducidad"
        header="Caducidad"
        value={lote => lote.caducidad}
        width={120}
      />
      <Column.Text
        id="descripcion"
        header="Descripción"
        value={lote => lote.descripcion}
        flexGrow={1}
        width={500}
      />
    </Table>
  );
}

export default React.memo(ListItemLineaLote);
