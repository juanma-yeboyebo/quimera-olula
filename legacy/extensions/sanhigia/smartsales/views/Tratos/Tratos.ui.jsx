import { Box } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue, useWidth } from "quimera";
import { useEffect } from "react";
import "./Tratos.style.scss";

function Tratos({ idTrato, modo }) {
  const [{ conTareasAtrasadas, tratos, tratosTareasAtrasadas }, dispatch] = useStateValue();
  const listaTratos = conTareasAtrasadas ? tratosTareasAtrasadas : tratos;

  useEffect(() => {
    dispatch({
      type: "onInit",
      payload: { modo },
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type:
        conTareasAtrasadas || (!!modo && modo === "tareasAtrasadas")
          ? "onIdTratosTareasAtrasadasProp"
          : "onIdTratosProp",
      payload: { id: idTrato ? parseInt(idTrato) : "" },
    });
  }, [dispatch, idTrato]);

  const width = useWidth();

  const mobile = ["xs", "sm"].includes(width);
  const desktop = !mobile;
  const masterVisible = desktop || (mobile && !listaTratos.current);
  const detalleVisible = !!listaTratos.current && listaTratos.current !== "nuevo";
  // const nuevoVisible = !!listaTratos.current && listaTratos.current === 'nuevo'

  return (
    <Quimera.Template id="Tratos">
      <Box mx={desktop ? 0.5 : 0}>
        <Box width={1} display="flex">
          {masterVisible && <Quimera.SubView id="Tratos/MasterTratos" />}
          {detalleVisible && (
            <Quimera.View
              id="Trato"
              idTrato={listaTratos.current}
              refreshCallback={() => dispatch({ type: "refreshTrato" })}
              deletedCallback={() => dispatch({ type: "deletedTrato" })}
            />
          )}
          {/* { nuevoVisible && <Quimera.SubView id='Tratos/NuevoUser' /> } */}
        </Box>
      </Box>
    </Quimera.Template>
  );
}

export default Tratos;
