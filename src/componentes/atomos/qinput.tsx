import "./_forminput.css";
import {
  Etiqueta,
  FormInput,
  FormInputProps,
  Validacion,
} from "./_forminput.tsx";
import { QInputMoneda } from "./QInputMoneda.tsx";

type QInputProps = FormInputProps;

export const QInput = ({
  label,
  nombre,
  deshabilitado,
  textoValidacion = "",
  erroneo,
  advertido,
  valido,
  opcional,
  condensado,
  tipo,
  ...props
}: QInputProps) => {
  const attrs = {
    nombre,
    erroneo,
    advertido,
    valido,
    opcional,
    condensado,
    deshabilitado,
    tipo,
  };

  const inputAttrs = {
    nombre,
    deshabilitado,
    opcional,
    tipo,
    ...props,
  };

  if (tipo === "moneda") {
    return (
      <quimera-input {...attrs}>
        <label>
          <Etiqueta label={label} />
          <QInputMoneda
            nombre={nombre}
            valor={props.valor ?? ""}
            onChange={(v, e) => props.onChange?.(v, e)}
            deshabilitado={deshabilitado}
            simbolo="€"
          />
          <Validacion textoValidacion={textoValidacion} />
        </label>
      </quimera-input>
    );
  }

  return (
    <quimera-input {...attrs}>
      <label>
        <Etiqueta label={label} />
        <FormInput {...inputAttrs} />
        <Validacion textoValidacion={textoValidacion} />
      </label>
    </quimera-input>
  );
};
