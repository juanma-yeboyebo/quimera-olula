import { ListItemPedido } from "@quimera-extension/base-area_clientes";
import { Avatar, Box, QBox, QBoxButton, QListModel } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import Quimera, { useStateValue, useWidth } from "quimera";
import { useCallback } from "react";

const useStyles = makeStyles(theme => ({
  avatar: {
    backgroundColor: `${theme.palette.success.main} !important`,
  },
  card: {
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
  },
  cardSelected: {
    borderBottom: `2px solid ${theme.palette.secondary.main}`,
    borderTop: `2px solid ${theme.palette.secondary.main}`,
  },
}));

function calculaColorAvatar(model) {
  if (model?.editable) {
    return "avatar";
  }

  return "";
}

function Master({ idPresupuesto }) {
  const [{ presupuestos }, dispatch] = useStateValue();
  const classes = useStyles();

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;

  const callbackNewPresupuestoChanged = useCallback(
    payload => dispatch({ type: "onNewPresupuestoChanged", payload }),
    [],
  );

  return (
    <Quimera.Template id="Master">
      <Box width={anchoDetalle}>
        <QBox
          titulo={idPresupuesto === "nuevo" ? "Nuevo presupuesto" : "Presupuestos"}
          sideButtons={
            <>
              <QBoxButton id="nuevoPresupuesto" title="Nuevo presupuesto" icon="add_circle" />
              <QBoxButton id="mostrarFiltro" title="Mostrar filtro" icon="search" />
            </>
          }
        >
          {idPresupuesto === "nuevo" && (
            <Quimera.View
              id="PresupuestoCliNuevo"
              callbackGuardado={callbackNewPresupuestoChanged}
            />
          )}
          <Quimera.SubView id="PresupuestosCli/Filter" />
          <QListModel
            data={presupuestos}
            modelName="presupuestos"
            ItemComponent={ListItemPedido}
            itemProps={{
              renderAvatar: model => (
                <Avatar className={classes[calculaColorAvatar(model)]}>
                  {model?.nombreCliente?.charAt(0)}
                </Avatar>
              ),
            }}
          />
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default Master;
