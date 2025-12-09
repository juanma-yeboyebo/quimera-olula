import { Box, Button } from "@quimera/comps";
import { useTranslation } from "@quimera/thirdparty";
import Quimera, { navigate, useStateValue } from "quimera";
import { useEffect } from "react";

function Producto({ referencia, useStyles }) {
  const [{ producto }, dispatch] = useStateValue();
  // const _c = useStyles()
  const { t } = useTranslation();

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: {
        referencia,
      },
    });
  }, [dispatch, referencia]);

  return (
    <Quimera.Template id="Producto">
      <Box width={1} mt={1} display="flex" justifyContent="center">
        <Box display="flex" flexDirection="column" justifyContent="center">
          <Quimera.SubView id="ItemCatalogo" model={producto} />
          <Box my={1} />
          <Button
            variant="outlined"
            color="primary"
            text={t("producto.irACatalogo")}
            onClick={() => {
              navigate("/catalogo");
            }}
          />
        </Box>
      </Box>
    </Quimera.Template>
  );
}

export default Producto;
