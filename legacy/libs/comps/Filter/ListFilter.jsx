import { useFilterValue } from "quimera/hooks";
import { useState } from "react";

import { Field, Icon, IconButton } from "..";

function ListFilter({ id, label, SearchComp, ...props }) {
  const [{ filter, schema }, addFilter, removeFilter] = useFilterValue();

  const [tmpValue, setTmpValue] = useState("");

  const schemaObj = schema?._get?.();
  const fieldsObj = schemaObj?._getFields?.();
  const fieldSchema = id ? fieldsObj?.[id.replace(/\//g, ".").split(".").pop()] : undefined;
  const fieldName = fieldSchema?._name;

  const onChange = newList => {
    if (newList.length === 0) {
      removeFilter(id);
    } else {
      addFilter(id, {
        filter: [[fieldName, "in", newList.map(child => child.key)]],
        value: newList,
      });
    }
  };

  const onAddChild = () => {
    if (tmpValue === "") {
      return;
    }
    const tmpFilter = filter?.[id]?.value ?? [];

    onChange([...tmpFilter, tmpValue.key ? tmpValue : { key: tmpValue, value: tmpValue }]);
    setTmpValue("");
  };
  const onDeleteChild = key => {
    const tmpFilter = filter?.[id]?.value ?? [];

    onChange(tmpFilter.filter(child => child.key !== key));
  };

  const searchProps = {
    id,
    value: tmpValue.key ?? tmpValue,
    label,
    onChange: event => setTmpValue(event.target.value),
    onBlur: onAddChild,
    fullWidth: true,
  };

  return (
    <>
      {SearchComp ? <SearchComp {...searchProps} /> : <Field.Text {...searchProps} />}

      {(filter?.[id]?.value ?? []).map(child => (
        <div key={child.key}>
          <IconButton id="deleteChild" size="small" onClick={() => onDeleteChild(child.key)}>
            <Icon>close</Icon>
          </IconButton>
          <span>{child.value}</span>
        </div>
      ))}
    </>
  );
}

export default ListFilter;
