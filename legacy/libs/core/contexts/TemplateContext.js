import React from "react";

const TemplateContext = React.createContext({
  references: [],
  parents: [],
});
TemplateContext.displayName = "TemplateContext";

export const TemplateProvider = TemplateContext.Provider;
export const TemplateConsumer = TemplateContext.Consumer;
export default TemplateContext;
