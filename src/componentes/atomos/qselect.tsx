import "./_forminput.css";
import { Etiqueta, FormFieldProps, Validacion } from "./_forminput.tsx";

type QSelectProps = FormFieldProps & {
  opciones: { valor: string; descripcion: string }[];
};

export const QSelect = ({
  label,
  nombre,
  deshabilitado,
  placeholder,
  opciones,
  valor = "",
  textoValidacion = "",
  erroneo,
  advertido,
  valido,
  opcional,
  condensado,
  onChange,
  onBlur,
}: QSelectProps) => {
  const attrs = {
    nombre,
    erroneo,
    advertido,
    valido,
    opcional,
    condensado,
    deshabilitado,
  };

  const renderOpciones = opciones.map((opcion) => (
    <option key={opcion.valor} value={opcion.valor}>
      {opcion.descripcion}
    </option>
  ));

  return (
    <quimera-select {...attrs}>
      <label>
        <Etiqueta label={label} />
        <select
          name={nombre}
          defaultValue={onChange ? undefined : valor}
          value={onChange ? valor : undefined}
          required={!opcional}
          disabled={deshabilitado}
          onChange={onChange ? (e) => onChange(e.target.value, e) : undefined}
          onBlur={onBlur ? (e) => onBlur(e.target.value, e) : undefined}
        >
          <option hidden value="">
            -{placeholder}-
          </option>
          {renderOpciones}
        </select>
        <Validacion textoValidacion={textoValidacion} />
      </label>
    </quimera-select>
  );
};
