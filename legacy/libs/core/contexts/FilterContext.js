import { createContext } from "react";

const FilterContext = createContext({
  filter: {},
  schema: null,
});
FilterContext.displayName = "FilterContext";

export const FilterProvider = FilterContext.Provider;
export const FilterConsumer = FilterContext.Consumer;
export default FilterContext;
