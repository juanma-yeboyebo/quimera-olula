import BaseField from "../BaseField";
import RealSelectField from "./RealSelectField";

function RealSelectBase({ id, ...props }) {
  return (
    <BaseField
      id={id}
      className={""}
      Component={<RealSelectField id={id} {...props} />}
      {...props}
    />
  );
}

export default RealSelectBase;
