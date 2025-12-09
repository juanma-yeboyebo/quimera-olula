import { useFilterValue } from "quimera/hooks";

import { Field } from "..";

function CheckBoxFilter({ id, label, operator = "eq", options, ...props }) {
  const [{ filter, schema }, addFilter, removeFilter] = useFilterValue();

  const schemaObj = schema?._get?.();
  const fieldsObj = schemaObj?._getFields?.();
  const fieldSchema = id ? fieldsObj?.[id.replace(/\//g, ".").split(".").pop()] : undefined;
  const fieldName = fieldSchema?._name;

  const markSelected = options => {
    const seleccionadas = filter[id] ? filter[id].value : [];

    return options.map(option => ({ ...option, checked: seleccionadas.includes(option.value) }));
  };

  const onChange = optionsSelected => {
    // const myFilter = { ...filter }
    if (optionsSelected.length == 0) {
      removeFilter(id);
    } else if (optionsSelected.length == 1) {
      addFilter(id, {
        filter: [fieldName, operator, optionsSelected[0]],
        value: optionsSelected,
      });
    } else {
      addFilter(id, {
        filter: { or: optionsSelected.map(option => [fieldName, operator, option]) },
        value: optionsSelected,
      });
    }
    // setFilter(id, myFilter)
  };

  return (
    <Field.CheckBox
      label={label}
      options={markSelected(options)}
      onChange={e => onChange(e.target.value)}
      {...props}
    />
  );
}

export default CheckBoxFilter;
