import { Field } from "@quimera/comps";

const options = [
  { key: "Llamada", value: "Llamada" },
  { key: "Email", value: "Email" },
  { key: "Whatsapp", value: "Whatsapp" },
  { key: "Cita", value: "Cita" },
];

export default function TipoTrato({ ...props }) {
  const getOptions = () => options;

  return <Field.Select getOptions={getOptions} options={options} {...props} async />;
}
