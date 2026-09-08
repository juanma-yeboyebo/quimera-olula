/* eslint-disable no-console */
import "./YearInCurso.style.scss";

import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import { navigate } from "quimera/base";
import PropTypes from "prop-types";
import { useStateValue } from "quimera";
import React from "react";
import { useDbState } from "use-db-state";

function YearInCurso({ _estilos, ...props }) {
  const [_state, _dispatch] = useStateValue();
  const [yearsSelected, setYearsSelected] = useDbState("yearsSelected", "", "ElGansoApp", "Years");

  const { className } = props;

  return (
    <div id="YearInCurso" className={className} onClick={() => navigate(`/year`)}>
      <InputLabel id="year-name-label">Años Seleccionados:</InputLabel>
      <Input labelid="year-name-label" value={yearsSelected.toString()} variant="outlined"></Input>
    </div>
  );
}

YearInCurso.propTypes = {
  estilos: PropTypes.object,
};
YearInCurso.defaultProps = {};

export default YearInCurso;
