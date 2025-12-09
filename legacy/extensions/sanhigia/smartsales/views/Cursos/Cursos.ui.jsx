import { QMasterDetail } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue } from "quimera";
import { useCallback, useEffect } from "react";

function Cursos({ codCurso }) {
  const [{ cursos }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "onInit",
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: "onIdCursosProp",
      payload: { id: codCurso ? codCurso : "" },
    });
  }, [dispatch, codCurso]);

  const callbackCursoChanged = useCallback(
    payload => dispatch({ type: "onCursosItemChanged", payload }),
    [dispatch],
  );

  console.log("????????????", codCurso, cursos?.current);

  return (
    <Quimera.Template id="Cursos">
      <QMasterDetail
        MasterComponent={<Quimera.SubView id="Cursos/MasterCursos" codCurso={codCurso} />}
        DetailComponent={
          <Quimera.View
            id="Curso"
            initCurso={cursos.dict[cursos.current]}
            callbackChanged={callbackCursoChanged}
          />
        }
        current={cursos.current}
      />
    </Quimera.Template>
  );
}

export default Cursos;
