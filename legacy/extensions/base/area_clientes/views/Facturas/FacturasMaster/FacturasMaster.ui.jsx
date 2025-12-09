import { Box } from "@quimera/comps";
import Quimera, { useWidth } from "quimera";

function FacturasMaster({ useStyles }) {
  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;

  return (
    <Quimera.Template id="FacturasMaster">
      <Box width={anchoDetalle}>
        hola mundo
        {/* <QBox titulo="Facturas">
          <List>
            {facturas.idList.map(idFactura => (
              <ListItemFactura
                key={idFactura}
                selected={idFactura === facturas.current}
                divider
                factura={facturas.dict[idFactura]}
                onClick={() =>
                  dispatch({
                    type: "onFacturasClicked",
                    payload: { item: facturas.dict[idFactura] },
                  })
                }
              />
            ))}
          </List>
        </QBox> */}
      </Box>
    </Quimera.Template>
  );
}

export default FacturasMaster;
