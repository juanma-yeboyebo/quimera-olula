import { Box } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import React, { useEffect } from "react";

function DashboardStocks({ id, useStyles }) {
  const [{ stocks, checkoutVisible }, dispatch] = useStateValue();
  // const classes = useStyles()

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: "onIdStocksProp",
      payload: { id },
    });
  }, [dispatch, id]);

  const width = useWidth();

  const mobile = ["xs", "sm"].includes(width);
  const desktop = !mobile;
  // const anchoDetalle = mobile ? 1 : 0.5
  const masterVisible =
    (desktop && !checkoutVisible) || (mobile && !stocks.current && !checkoutVisible);
  const detalleVisible =
    (desktop && !checkoutVisible) || (mobile && stocks.current && !checkoutVisible);

  return (
    <Quimera.Template id="DashboardStocks">
      <Box mx={desktop ? 1 : 0}>
        <Box width={1} display="flex">
          {masterVisible && <Quimera.SubView id="DashboardStocks/StocksMaster" />}
          {detalleVisible && <Quimera.SubView id="DashboardStocks/StocksDetalle" />}
          {checkoutVisible && <Quimera.SubView id="DashboardStocks/StocksCheckout" />}
        </Box>
      </Box>
    </Quimera.Template>
  );
}

export default DashboardStocks;
