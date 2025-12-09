import { Icon, KeyboardTimePicker } from "@quimera/thirdparty";
import React, { useEffect, useState } from "react";

function TimeField({ value, onChange, ...props }) {
  const [showedValue, setShowedValue] = useState(parseValue(value));

  function parseValue(value) {
    return value ? Date.parse(`1971-01-01T${value}+01:00`) : value;
  }
  function isValidTime(d) {
    return (d instanceof Date && !isNaN(d)) || d === null; // null si pulsamos a borrar
  }

  function handleTimeChange(value) {
    setShowedValue(value);
    if (!isValidTime(value)) {
      return;
    }

    return onChange({
      target: {
        // El inglés británico usa formato de 24 horas sin AM/PM
        value: value ? value.toLocaleTimeString("en-GB") : value,
      },
    });
  }

  useEffect(() => {
    setShowedValue(parseValue(value));
  }, [value]);

  return (
    <KeyboardTimePicker
      value={showedValue}
      ampm={false}
      autoOk={true}
      // inputVariant='outlined'
      margin="dense"
      // views={['hours', 'minutes', 'seconds']} // Cambiado para dailyjob. Hablar con Antonio si hacen falta segundos para otro proyecto
      // format= {'HH:mm:ss'}
      views={["hours", "minutes"]}
      format={"HH:mm"}
      onChange={handleTimeChange}
      cancelLabel="CANCELAR"
      clearLabel="BORRAR"
      okLabel="ACEPTAR"
      clearable
      KeyboardButtonProps={{
        size: "small",
      }}
      keyboardIcon={<Icon>schedule</Icon>}
      invalidDateMessage="Formato de hora no válido"
      {...props}
    />
  );
}

export default TimeField;
