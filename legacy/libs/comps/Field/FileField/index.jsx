import { Field } from "../";

export default function FileField({ ...props }) {
  return (
    <Field.Text
      type="file"
      getEventValue={e => e.target.files}
      preFormat={value => value.name}
      {...props}
    />
  );
}
