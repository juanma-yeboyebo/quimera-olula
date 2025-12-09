import { Box, QListModel } from "@quimera/comps";
import Quimera, { useStateValue, useWidth } from "quimera";

import { ListItemCampana } from "../../../comps";

function CampanasComercioDetail({ idComercio }) {
  const [{ arrayMultiCheck, habilitarMulticheck, campanas, campanasComercio }, dispatch] =
    useStateValue();

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;

  return (
    <Quimera.Template id="CampanasComercioDetail">
      <Box width={anchoDetalle}>
        <QListModel
          data={campanas}
          modelName={habilitarMulticheck ? "campanasCheck" : "campanas"}
          // modelName={"comercios"}
          ItemComponent={ListItemCampana}
          itemProps={{
            renderId: () => campanas.dict[1]?.nombre,
            habilitarMulticheck,
            arrayMultiCheck,
          }}
          funSecondaryLeft={campana =>
            campana.nombre ? campana.nombre : "Sin nombre"
          }
        />
      </Box>
    </Quimera.Template>
  );
}

export default CampanasComercioDetail;
