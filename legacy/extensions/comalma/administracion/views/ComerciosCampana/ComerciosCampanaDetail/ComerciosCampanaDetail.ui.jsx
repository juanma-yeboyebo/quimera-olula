import { Box, QBox, QListModel } from "@quimera/comps";
import Quimera, { useStateValue, useWidth } from "quimera";

import { ListItemComercioCampana } from "../../../comps";

function ComerciosCampanaDetail({ idCampana, useStyles }) {
  const [{ comercios, comerciosCampana }, dispatch] = useStateValue();
  const classes = useStyles();
  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;

  // const callbackNewComercioChanged = useCallback(
  //   payload => dispatch({ type: "onNewComercioChanged", payload }),
  //   [],
  // );

  // let comerciosVisibles = comercios;
  // comerciosVisibles.idList = comercios.idList.filter(x => !comerciosCampana.idList.includes(x));

  const comerciosVisibles = {
    idList: comercios.idList.filter(x => !comerciosCampana.idList.includes(x)),
    dict: { ...comercios.dict },
  };

  const estilosQBox = {
    summary: classes.summary,
  };

  return (
    <Quimera.Template id="ComerciosCampanaDetail">
      <Box width={anchoDetalle}>
        <QBox
          titulo="Establecimientos"
          botonesCabecera={[
            { icon: "add_circle", id: "anadirTodosComerciosCampana", text: "Añadir todos" },
          ]}
          estilos={estilosQBox}
        // sideButtons={
        //   <>
        //     <QBoxButton id="anadirTodosComerciosCampana" title="Añadir todos" icon="add_circle" />
        //   </>
        // }
        >
          <QListModel
            data={comerciosVisibles}
            modelName={"comercios"}
            ItemComponent={ListItemComercioCampana}
            itemProps={{
              renderId: () => comercios.dict[1]?.nombre,
              type: "add",
              idCampana,
            }}
            funSecondaryLeft={comercio => (comercio.nombre ? comercio.nombre : "Sin nombre")}
          />
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default ComerciosCampanaDetail;
