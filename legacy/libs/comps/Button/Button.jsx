import { useStateValue, util } from "quimera";

import RawButton from "./RawButton";

function Button({ id, data, ...props }) {
  const [, dispatch] = useStateValue();

  const handleClick = e => {
    dispatch({
      type: `on${util.camelId(id)}Clicked`,
      payload: {
        data,
        event: e,
      },
    });
  };

  return <RawButton id={id} onClick={handleClick} {...props} />;
}

export default Button;
