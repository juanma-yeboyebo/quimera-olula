import { ListItemAlbaran } from "@quimera-extension/base-albaranes";
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
  if (model?.pteFactura) {
    return "avatar";
  }

  return "";
}

function AlbaranesMaster({ idAlbaran }) {
  const [{ albaranes, filtroVisible }, dispatch] = useStateValue();
  const classes = useStyles();

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;

  const callbackNewAlbaranChanged = useCallback(
    payload => dispatch({ type: "onNewAlbaranChanged", payload }),
    [],
  );
  <QBoxButton id="mostrarFiltro" title="Mostrar filtro" icon="search" />;

  return (
    <Quimera.Template id="AlbaranesMaster">
      <Box width={anchoDetalle}>
        <QBox
          titulo={idAlbaran === "nuevo" ? "Nuevo albaran" : "Albaranes"}
          sideButtons={
            <>
              <QBoxButton id="nuevoAlbaran" title="Nuevo albaran" icon="add_circle" />
              <QBoxButton id="mostrarFiltro" title="Mostrar filtro" icon="search" />
            </>
          }
        >
          {idAlbaran === "nuevo" && (
            <Quimera.View id="AlbaranesCliNuevo" callbackGuardado={callbackNewAlbaranChanged} />
          )}
          <Quimera.SubView id="AlbaranesCli/AlbaranesFiltro" />
          <QListModel
            data={albaranes}
            modelName="albaranes"
            ItemComponent={ListItemAlbaran}
            itemProps={{
              renderAvatar: model => (
                <Avatar className={classes[calculaColorAvatar(model)]}>
                  {model?.nombreCliente?.charAt(0)}
                </Avatar>
              ),
            }}
            scrollable={true}
            altoCabecera={160}
          />
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default AlbaranesMaster;
