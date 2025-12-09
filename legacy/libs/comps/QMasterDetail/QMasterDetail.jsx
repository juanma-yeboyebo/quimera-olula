import { useWidth } from "quimera";

import { Box } from "../";

function QMasterDetail({ MasterComponent, DetailComponent, current, loading = false, variant = "partida_vertical" }) {
  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const desktop = !mobile;
  const variantDict = {
    partida_vertical: {
      masterVisible: desktop || (mobile && !current) || (mobile && current === "nuevo"),
      detalleVisible: !!current && current !== "nuevo",
    },
    fullscreen: { masterVisible: !current, detalleVisible: current },
    onlydetail: { masterVisible: loading, detalleVisible: current },
  };

  const masterVisible = variantDict[variant].masterVisible;
  const detalleVisible = variantDict[variant].detalleVisible;

  return (
    <Box mx={desktop ? 0.5 : 0}>
      <Box width={1} display="flex" justifyContent={variant === "onlydetail" ? "center" : "none"}>
        {masterVisible && MasterComponent}
        {detalleVisible && DetailComponent}
      </Box>
    </Box>
  );
}

export default QMasterDetail;
