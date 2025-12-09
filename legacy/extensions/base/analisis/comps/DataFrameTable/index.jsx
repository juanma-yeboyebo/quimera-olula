import { Box } from "@quimera/comps";
import { useStateValue, util } from "quimera";
// import { useCallback, useEffect, useState } from "react";
import "./DataFrameTable.style.scss";

function formateaValor(valor, campo) {
  const medida = campo.slice(1, -1).split(",")[0].slice(1, -1);
  if (medida === 'm_venta') {
    return util.euros(valor);
  }
  return valor;
}

function dameCabeceraY(nivelY) {
  const [{ medidas, nivelesX, nivelesY }, dispatch] = useStateValue();
  const levels = nivelesY.length ?? 1;
  const extraCabeceraY = levels > 1 ? dameCabeceraYExtra(nivelY) : (<></>);
  const cabeceraY = (<Box display={"flex"} flexDirection={"column"}>{nivelY.map((y, idx) => (
    <Box className="DataFrameTableValueBox">{levels > 1 ? stringToArr(y)[levels - 1]?.trim().replace(/'/g, "") : y}</Box>
  ))}</Box>);
  return (<>{extraCabeceraY}{cabeceraY}</>);
}

function stringToArr(item) {
  return item.slice(1, -1).split(/,(?=(?:(?:[^']*'){2})*[^']*$)/);
}

function dameCabeceraYExtra(nivelX) {
  const [{ nivelesY }] = useStateValue();
  const levels = nivelesY.length ?? 1;
  return (<Box display={"flex"} flexDirection={"column"}>{nivelX.map((x, idx) => (
    <Box className="DataFrameTableValueBox">{stringToArr(x)[levels - 2].trim().replace(/'/g, "")}</Box>
  ))}</Box>);
}

// function dameCabeceraXExtra(nivelX) {
//   const [{ nivelesX }] = useStateValue();
//   const levels = nivelesX.length ?? 1;
//   return (<Box display={"flex"}>{nivelX.map((x, idx) => (
//     <Box className="DataFrameTableValueBox">{x.slice(1, -1).split(/,(?=(?:(?:[^']*'){2})*[^']*$)/)[levels - 1].trim().replace(/'/g, "")}</Box>
//   ))}</Box>);
// }

function dameCabeceraX(nivelX) {
  const [{ medidas, nivelesX, nivelesY }, dispatch] = useStateValue();
  const levels = nivelesX.length ?? 0;

  // let extraCabeceraX = levels < 0 ? dameCabeceraXExtra(nivelX) : (<></>);
  const cabeceraX = nivelX.map((x, idx) => {
    const classNameHead = "DataFrameTableValueBox";
    return (<Box display={"flex"} className={classNameHead}>{stringToArr(x).length > 1 ? stringToArr(x)[levels].trim().replace(/'/g, "") : stringToArr(x)[0].trim().replace(/'/g, "")}</Box>);
  });
  return (<>{cabeceraX}</>);
}

function compruebaNivelX(x, idx, nivelesXAux, valuesAux, sumX, values, nivelesUsados) {
  const arrX = stringToArr(x);
  arrX.shift();
  if (arrX.length > 1) {
    arrX.pop();
  }

  arrX.map((cabeceraX, index) => {
    const cabecera = cabeceraX.trim().replace(/'/g, "");
    if (sumX[index][cabecera] && !nivelesUsados[index]?.includes(cabecera)) {
      const sumValues = Object.values(sumX[index][cabecera]);
      nivelesXAux.push('(' + cabeceraX + ')');

      if (index in nivelesUsados) {
        nivelesUsados[index]?.push(cabecera);
      } else {
        nivelesUsados[index] = [];
        nivelesUsados[index]?.push(cabecera);
      }

      valuesAux.push(sumValues);
    }
  });
  nivelesXAux.push(x);
  valuesAux.push(values[idx]);
}

function procesaDataframe(data, sumX) {
  const nivelX = Object.keys(data);
  const nivelY = nivelX.map(y => Object.keys(data[y]))[0];
  const values = nivelX.map(y => Object.values(data[y]));

  let nivelXAux = [];
  let valuesAux = [];
  let nivelesUsados = {};
  nivelX.map((x, idx) => compruebaNivelX(x, idx, nivelXAux, valuesAux, sumX, values, nivelesUsados));

  return { nivelX: nivelXAux, nivelY, values: valuesAux };
}

function DataFrameTable({ id, data, sumX, ...props }) {
  const [_, dispatch] = useStateValue();

  if (!data) {
    return <></>
  }
  const { nivelX, nivelY, values } = procesaDataframe(JSON.parse(data), sumX);
  if (!nivelX || !nivelY || !values) {
    return <></>
  }

  return (
    <Box display={"flex"} flexDirection={"column"} className="DataFrameTable">

      <Box className="DataFrameTableCabecera">
        <Box className="DataFrameTableNivelX">ventas</Box>
        <Box display={"flex"} className="DataFrameTableCabeceraX">
          {dameCabeceraX(nivelX)}
        </Box>
      </Box>
      <Box display={"flex"} className="DataFrameTableCuerpo">
        <Box className="DataFrameTableNivelY" display={"flex"} >
          {dameCabeceraY(nivelY)}
        </Box>
        <Box display="flex">
          {(values ?? []).map((column, idx) => (
            <Box>{column.map((columnVal => (<Box className="DataFrameTableValueBox">{formateaValor(columnVal, nivelX[idx])}</Box>)))}</Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default DataFrameTable;
