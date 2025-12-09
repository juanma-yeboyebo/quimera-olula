import { createContext } from "react";

const ModelContext = createContext({
  disabled: false,
  model: {},
  modelName: null,
  schema: null,
});
ModelContext.displayName = "ModelContext";

export const ModelProvider = ModelContext.Provider;
// export const ModelConsumer = ModelContext.Consumer
export default ModelContext;
