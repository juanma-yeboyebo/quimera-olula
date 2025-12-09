import { ModelProvider, useStateValue, util } from "quimera";
import { useState } from "react";

function QModelBox({ children, disabled, id, schema, ...props }) {
  const [modelContext, setModelContext] = useState({});
  const [state, _] = useStateValue();

  const model = util.getStateValue(id, state);

  return (
    <ModelProvider
      value={[
        {
          disabled,
          model,
          modelName: id,
          schema,
        },
        setModelContext,
      ]}
    >
      {children}
    </ModelProvider>
  );
}

export default QModelBox;
