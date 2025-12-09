import { util } from "quimera";
import { useFilterValue } from "quimera/hooks";
import { useEffect, useState } from "react";

import { Field } from "../";

function SchemaFilter({ id, type, operator, initial, Comp, ...props }) {
  const [{ filter, schema }, addFilter, removeFilter] = useFilterValue();
  const [dirty, setDirty] = useState(false);

  const schemaObj = schema?._get?.();
  const fieldName = id.replace(/\//g, ".").split(".").pop();
  const fieldsObj = schemaObj?._getFields?.();
  const fieldSchema = fieldsObj?.[fieldName];
  const paramSet = fieldSchema?._paramSet;

  console.log("schemafilter", filter);
  const value = filter?.[id]?.value ?? (dirty ? null : initial);
  const onChange = (newFilter, newValue) => {
    setDirty(true);
    if ([null, "", undefined].includes(newValue)) {
      removeFilter(id);
    } else {
      addFilter(id, {
        filter: newFilter,
        value: newValue,
      });
    }
  };

  const filterOperator = () => {
    const filterType = fieldSchema?._type;
    const defaults = {
      Text: "like",
      TextArea: "like",
      Password: "like",
      Int: "eq",
      Float: "eq",
      Currency: "eq",
      Bool: "eq",
      Options: "eq",
    };

    return filterType in defaults ? defaults[filterType] : "like";
  };

  const buildFilterClause = (name, value) => {
    const filterType = fieldSchema?._type;

    switch (filterType) {
      case "Date": {
        return [
          value?.desde && [name, "gte", value?.desde],
          value?.hasta && [name, "lte", value?.hasta],
        ].filter(Boolean);
      }
      default: {
        return [name, operator ? operator : filterOperator(), value];
      }
    }
  };
  const eventFilterValue = event => {
    const filterType = fieldSchema?._type;
    switch (filterType) {
      case "Int":
      case "Float":
      case "Currency": {
        return event?.floatValue ?? event?.target?.value;
      }
      default: {
        return event.target.value;
      }
    }
  };
  const translationKey = `schemas.${schema?.id}.${fieldName}`;
  const commonProps = {
    id,
    value,
    label: util.translate(fieldSchema?._alias || translationKey) ?? "",
    onChange: event => {
      const value = eventFilterValue(event);
      onChange(buildFilterClause(fieldSchema?._name, value?.key ?? value), value?.key ?? value);
    },
    ...props,
  };

  useEffect(() => {
    let filterValue = value;
    if (value?.interval) {
      const [interval, n] = filterValue.interval.split("-");
      const intervalo = n ? util.dynamicIntervals[interval](n) : util.intervalos[interval];

      filterValue = {
        ...filterValue,
        desde: intervalo?.desde?.() ?? null,
        hasta: intervalo?.hasta?.() ?? null,
      };
    }
    initial && onChange(buildFilterClause(fieldSchema?._name, filterValue), filterValue);
  }, []);

  if (Comp) {
    // return React.cloneElement(Comp, { ...commonProps })
    return <Comp fullWidth {...commonProps} />;
  }

  switch (fieldSchema?._type) {
    case "Text":
      return <Field.Text fullWidth {...commonProps} />;
    case "Password":
      return <Field.Password fullWidth {...commonProps} />;
    case "Date": {
      const field = {
        interval: (
          <Field.Interval
            fullWidth
            {...commonProps}
            value={value?.interval ?? ""}
            onChange={event =>
              onChange(
                [
                  event?.desde && [fieldSchema?._name, "gte", event?.desde],
                  event?.hasta && [fieldSchema?._name, "lte", event?.hasta],
                ].filter(Boolean),
                {
                  interval: event.target.value ?? "",
                  desde: event.desde,
                  hasta: event.hasta,
                },
              )
            }
          />
        ),
        desde: (
          <Field.Date
            fullWidth
            {...commonProps}
            label={`${commonProps.label} desde`}
            value={value?.desde}
            onChange={event =>
              onChange(
                [
                  event.target.value && [fieldSchema?._name, "gte", event.target.value],
                  value?.hasta && [fieldSchema?._name, "lte", value?.hasta],
                ].filter(Boolean),
                {
                  interval: "",
                  desde: event.target.value,
                  hasta: value?.hasta,
                },
              )
            }
          />
        ),
        hasta: (
          <Field.Date
            fullWidth
            {...commonProps}
            label={`${commonProps.label} hasta`}
            value={value?.hasta}
            onChange={event =>
              onChange(
                [
                  value?.desde && [fieldSchema?._name, "gte", value?.desde],
                  event.target.value && [fieldSchema?._name, "lte", event.target.value],
                ].filter(Boolean),
                {
                  interval: "",
                  desde: value?.desde,
                  hasta: event.target.value,
                },
              )
            }
          />
        ),
      };

      return (
        field[type] ?? (
          <>
            {field.interval}
            {field.desde}
            {field.hasta}
          </>
        )
      );
    }
    // case 'Time':
    //   return <Field.Time {...commonProps}/>
    case "Int":
      return <Field.Int fullWidth {...commonProps} />;
    case "Float":
      return <Field.Float fullWidth decimals={paramSet?._decimals} {...commonProps} />;
    case "Currency":
      return (
        <Field.Currency
          fullWidth
          decimals={paramSet?._decimals}
          currency={paramSet?._currency}
          {...commonProps}
        />
      );
    case "Bool":
      return (
        <Field.CheckBox
          {...commonProps}
          checked={value ?? false}
          onChange={event =>
            onChange([fieldSchema?._name, "eq", event.target.value], event.target.value)
          }
          {...props}
        />
      );
    case "Options":
      return (
        <Field.Select
          {...commonProps}
          options={paramSet?._options}
          fullWidth
          onChange={event => {
            const value = event.target.value?.key || null;
            onChange([fieldSchema?._name, "eq", value], value);
          }}
        />
      );
    case "TextArea":
      return <Field.TextArea fullWidth {...commonProps} />;
    default:
      console.error(
        `Tipo de campo no contemplado en Filter.Schema: ${fieldSchema?._type} sobre el campo ${id}`,
      );

      return <Field.Text fullWidth {...commonProps} />;
  }
}

export default SchemaFilter;
