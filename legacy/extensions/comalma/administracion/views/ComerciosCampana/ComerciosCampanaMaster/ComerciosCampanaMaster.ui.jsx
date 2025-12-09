import { Box, QBox, QListModel } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";

import { ListItemComercioCampana } from "../../../comps";

function ComerciosCampanaMaster({ idCampana, useStyles }) {
  const [{ campanas, comerciosCampana }, dispatch] = useStateValue();
  const classes = useStyles();
  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;

  // const callbackNewComercioChanged = useCallback(
  //   payload => dispatch({ type: "onNewComercioChanged", payload }),
  //   [],
  // );

  const estilosQBox = {
    summary: classes.summary,
  };

  return (
    <Quimera.Template id="ComerciosCampanaMaster">
      <Box width={anchoDetalle} display={"flex"} justifyContent={"flex-end"}>
        <QBox
          titulo="Establecimientos en campaña"
          botonesCabecera={[
            { icon: "remove_circle", id: "quitarTodosComerciosCampana", text: "Quitar todos" },
          ]}
          estilos={estilosQBox}
        // sideButtons={
        //   <>
        //     <QBoxButton id="quitarTodosComerciosCampana" title="Quitar todos" icon="remove_circles" />
        //   </>
        // }
        >
          <QListModel
            data={comerciosCampana}
            modelName={"comercios"}
            // modelName={"comercios"}
            ItemComponent={ListItemComercioCampana}
            itemProps={{
              renderId: () => comerciosCampana.dict[idComercio]?.nombre,
              type: "remove",
              idCampana,
            }}
            funSecondaryLeft={comercio => (comercio.nombre ? comercio.nombre : "Sin nombre")}
          />
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default ComerciosCampanaMaster;
