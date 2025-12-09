import BaseField from "../BaseField";
import SwitchField from "./SwitchField";

function SwitchBase({ id, ...props }) {
  return <BaseField id={id} className={""} Component={<SwitchField id={id} />} {...props} />;
}

export default SwitchBase;
