import { getSchemas } from "../";

const msgFormat = "Formato incorrecto";
const msgRequired = "Valor requerido";
const msgLength = "Valor demasiado largo";

class FieldRunner {
  defaultLoad(params, values, field) {
    let value = values[field];
    if (value === undefined) {
      value = null;
    }
    if (value === null && params._default !== null) {
      if (typeof params._default === "function") {
        value = params._default();
      } else {
        value = params._default;
      }
    }

    return value;
  }

  defaultDump(params, values, field) {
    let value = values[field];
    if (value === undefined) {
      value = null;
    }
    if (value === null && params._default !== null) {
      if (typeof params._default === "function") {
        value = params._default();
      } else {
        value = params._default;
      }
    }

    return value;
  }

  defaultValidation(field, values, fieldName) {
    const params = field._paramSet;
    const value = values[fieldName];

    if (params._auto) {
      return false;
    }
    if (params._length && value && value.length > params._length) {
      return { error: true, message: msgLength };
    }
    if (
      params._required &&
      (value === null || value === undefined || (field._type === "Text" && value === ""))
    ) {
      return { error: true, message: msgRequired };
    }
    if (value && params._pattern && !params._pattern.test(value)) {
      return { error: true, message: msgFormat };
    }

    return false;
  }
}

class SubschemaRunner {
  defaultLoad(subschema, values, subschemaKey) {
    // Implementado type = List
    const apiValue = values[subschemaKey];
    if (apiValue === undefined) {
      return [];
    }
    const schema = getSchemas()[subschema._schema];
    const result = apiValue.map(element => schema.load(element));

    return result;
  }

  defaultDump(params, values, field) {
    // TO DO (copia de field)
    let value = values[field];
    if (value === undefined) {
      value = null;
    }
    if (value === null && params._default !== null) {
      value = params._default;
    }

    return value;
  }

  defaultValidation(field, values, fieldName) {
    // TO DO (copia de field)
    const params = field._paramSet;
    const value = values[fieldName];

    if (params._auto) {
      return false;
    }
    if (params._length && value && value.length > params._length) {
      return { error: true, message: msgLength };
    }
    if (
      params._required &&
      (value === null || value === undefined || (field._type === "Text" && value === ""))
    ) {
      return { error: true, message: msgRequired };
    }
    if (value && params._pattern && !params._pattern.test(value)) {
      return { error: true, message: msgFormat };
    }

    return false;
  }
}

class FieldParams {
  constructor() {
    this._auto = null;
    this._length = null;
    this._required = null;
    this._default = null;
    this._pattern = null;
    this._decimals = null;
    this._currency = null;
    this._options = null;
    this._load = null;
    this._dump = null;
    this._validation = null;
  }

  copy() {
    const copyObj = new FieldParams();
    copyObj._auto = this._auto;
    copyObj._length = this._length;
    copyObj._required = this._required;
    copyObj._default = this._default;
    copyObj._pattern = this._pattern;
    copyObj._decimals = this._decimals;
    copyObj._currency = this._currency;
    copyObj._options = this._options;
    copyObj._load = this._load;
    copyObj._dump = this._dump;
    copyObj._validation = this._validation;

    return copyObj;
  }
}

class SubschemaParams {
  constructor() {
    this._load = null;
    this._dump = null;
    this._validation = null;
  }

  copy() {
    const copyObj = new SubschemaParams();
    copyObj._load = this._load;
    copyObj._dump = this._dump;
    copyObj._validation = this._validation;

    return copyObj;
  }
}

class FieldKlass {
  constructor(type, name, alias) {
    this._type = type;
    this._name = name;
    this._alias = alias;
    this._paramSet = new FieldParams();
    this._runner = new FieldRunner();
  }

  auto() {
    this._paramSet._auto = true;

    return this;
  }

  length(value) {
    this._paramSet._length = value;

    return this;
  }

  required() {
    this._paramSet._required = true;

    return this;
  }

  default(value) {
    this._paramSet._default = value;

    return this;
  }

  pattern(value) {
    this._paramSet._pattern = value;

    return this;
  }

  decimals(value) {
    this._paramSet._decimals = value;

    return this;
  }

  currency(value) {
    this._paramSet._currency = value;

    return this;
  }

  options(value) {
    this._paramSet._options = value;

    return this;
  }

  load(value) {
    this._paramSet._load = value;

    return this;
  }

  dump(value) {
    this._paramSet._dump = value;

    return this;
  }

  validation(value) {
    this._paramSet._validation = value;

    return this;
  }

  makeLoad(values, field) {
    return (
      this._paramSet._load?.(values) ?? this._runner.defaultLoad(this._paramSet, values, field)
    );
  }

  makeDump(values, field) {
    return (
      this._paramSet._dump?.(values) ?? this._runner.defaultDump(this._paramSet, values, field)
    );
  }

  makeValidation(values, field) {
    return (
      this._paramSet._validation?.(values) ?? this._runner.defaultValidation(this, values, field)
    );
  }

  copy() {
    const copyObj = new FieldKlass(this._type, this._name, this._alias);
    copyObj._paramSet = this._paramSet.copy();

    return copyObj;
  }
}

class SubschemaKlass {
  constructor(type, name, schema) {
    this._type = type;
    this._name = name;
    this._schema = schema;
    this._paramSet = new SubschemaParams();
    this._runner = new SubschemaRunner();
  }

  load(value) {
    this._paramSet._load = value;

    return this;
  }

  // dump(value) {
  //   this._paramSet._dump = value
  //   return this
  // }

  makeLoad(values, field) {
    // return this._paramSet._load?.(values) ?? this._runner.defaultLoad(this._paramSet, values, field)
    return this._paramSet._load?.(values) ?? this._runner.defaultLoad(this, values, field);
  }

  // makeDump(values, field) {
  //   return this._paramSet._dump?.(values) ?? this._runner.defaultDump(this._paramSet, values, field)
  // }

  // makeValidation(values, field) {
  //   return this._paramSet._validation?.(values) ?? this._runner.defaultValidation(this, values, field)
  // }

  copy() {
    const copyObj = new SubschemaKlass(this._type, this._name, this._schema);
    copyObj._paramSet = this._paramSet.copy();

    return copyObj;
  }
}

const fieldsValidation = (uiData, fields, field) =>
  field
    ? fields[field].makeValidation(uiData, field)
    : Object.keys(fields)
        .filter(item => fields[item]._paramSet._validation !== false)
        .reduce(
          (obj, item) => ({
            ...obj,
            [item]: fields[item].makeValidation(uiData, item),
          }),
          {},
        );

class SchemaRunner {
  extract(fields, subschemas) {
    return {
      load: (apiData, { partial = false } = {}) => {
        const loadedFields = Object.keys(fields)
          .filter(item => {
            // console.log('fields', Object.keys(fields))
            // console.log('apiData', apiData)
            // console.log('itemss', item)
            // console.log('partial', partial)
            return (
              fields[item]._paramSet._load !== false && (!partial || fields[item]._name in apiData)
            );
          })
          .reduce(
            (obj, item) => ({
              ...obj,
              [item]: fields[item].makeLoad(apiData, fields[item]._name),
            }),
            {},
          );
        const loadedSubschemas = subschemas
          ? Object.keys(subschemas)
              .filter(item => {
                return (
                  subschemas[item]._paramSet._load !== false &&
                  (!partial || subschemas[item]._name in apiData)
                );
              })
              .reduce(
                (acum, item) => ({
                  ...acum,
                  [item]: subschemas[item].makeLoad(apiData, subschemas[item]._name),
                }),
                {},
              )
          : {};

        return {
          ...loadedFields,
          ...loadedSubschemas,
        };
      },
      dump: (uiData, { partial = false, includeNullish = true } = {}) =>
        Object.keys(fields)
          .filter(item => {
            return (
              fields[item]._paramSet._dump !== false &&
              // !fields[item]._paramSet._auto &&
              (!partial || item in uiData) &&
              (includeNullish || (uiData[item] !== null && uiData[item] !== undefined))
            );
          })
          .reduce(
            (obj, item) => ({
              ...obj,
              [fields[item]._name]: fields[item].makeDump(uiData, item),
            }),
            {},
          ),
      validation: (uiData, field) => fieldsValidation(uiData, fields, field),
      isValid: uiData => {
        const validation = fieldsValidation(uiData, fields);

        return Object.keys(validation).reduce(
          (acum, item) => (validation[item] !== false ? false : acum),
          true,
        );
      },
    };
  }
}

class SchemaParams {
  constructor() {
    this._filter = null;
    this._limit = null;
    this._order = null;
  }

  copy() {
    const copyObj = new SchemaParams();
    copyObj._filter = this._filter;
    copyObj._limit = this._limit;
    copyObj._order = this._order;

    return copyObj;
  }

  extract() {
    return {
      ...(this._filter && { filter: this._filter }),
      ...(this._order && { order: this._order }),
      ...(this._limit && { limit: this._limit }),
    };
  }
}

class SchemaFields {
  constructor() {
    this._fields = {};
  }

  add(fields) {
    this._fields = {
      ...(this._fields ?? {}),
      ...fields,
    };
  }

  get() {
    return this._fields;
  }

  copy() {
    const copyObj = new SchemaFields();
    copyObj.add(
      Object.keys(this._fields).reduce(
        (obj, item) => ({ ...obj, [item]: this._fields[item].copy() }),
        {},
      ),
    );

    return copyObj;
  }

  extract() {
    return {
      fields: Object.keys(this._fields)
        .filter(f => !!this._fields[f]._name && !!(this._fields[f]._paramSet._load ?? true))
        .map(f => this._fields[f]._name)
        .join(","),
    };
  }
}

class SchemaSubschemas {
  constructor() {
    this._subschemas = {};
  }

  add(subschemas) {
    this._subschemas = {
      ...(this._subschemas ?? {}),
      ...subschemas,
    };
  }

  get() {
    return this._subschemas;
  }

  copy() {
    const copyObj = new SchemaSubschemas();
    copyObj.add(
      Object.keys(this._subschemas).reduce(
        (obj, item) => ({ ...obj, [item]: this._subschemas[item].copy() }),
        {},
      ),
    );

    return copyObj;
  }

  extract() {
    return {
      subschemas: Object.keys(this._subschemas)
        .filter(s => !!this._subschemas[s]._name && !!(this._subschemas[s]._paramSet._load ?? true))
        .map(s => this._subschemas[s]._name)
        .join(","),
    };
  }
}

class SchemaKlass {
  constructor(model, pk) {
    this._model = model;
    this._pk = pk;
    this._api = "default";
    this._fieldSet = new SchemaFields();
    this._subschemaSet = new SchemaSubschemas();
    this._paramSet = new SchemaParams();
    this._runner = new SchemaRunner();
  }

  pk() {
    return this._pk;
  }

  api(api) {
    this._api = api;

    return this;
  }

  fields(fields) {
    this._fieldSet.add(fields);

    return this;
  }

  subschemas(subschemas) {
    this._subschemaSet.add(subschemas);

    return this;
  }

  filter(filter) {
    this._paramSet._filter = filter;

    return this;
  }

  limit(limit) {
    this._paramSet._limit = limit;

    return this;
  }

  order(order) {
    this._paramSet._order = order;

    return this;
  }

  copy() {
    const copyObj = new SchemaKlass(this._model, this._pk);
    copyObj._api = this._api;
    copyObj._fieldSet = this._fieldSet.copy();
    copyObj._subschemaSet = this._subschemaSet.copy();
    copyObj._paramSet = this._paramSet.copy();

    return copyObj;
  }

  _getFields() {
    return this._fieldSet.get();
  }

  _getSubschemas() {
    return this._subschemaSet.get();
  }

  _getName() {
    return this._model;
  }

  extract(id) {
    return {
      id,
      name: this._model,
      key: this._pk,
      api: this._api,
      ...this._fieldSet.extract(),
      ...this._subschemaSet.extract(),
      ...this._paramSet.extract(),
      ...this._runner.extract(this._fieldSet.get(), this._subschemaSet.get()),
      _get: () => this,
    };
  }
}

export const Subschema = {
  List: (name, schema) => new SubschemaKlass("List", name, schema),
};

export const Field = {
  Int: (field, alias) => new FieldKlass("Int", field, alias),
  Float: (field, alias) => new FieldKlass("Float", field, alias).decimals(2),
  Currency: (field, alias) => new FieldKlass("Currency", field, alias).decimals(2).currency("€"),
  Text: (field, alias) => new FieldKlass("Text", field, alias),
  TextArea: (field, alias) => new FieldKlass("TextArea", field, alias),
  Options: (field, alias) => new FieldKlass("Options", field, alias),
  Password: (field, alias) => new FieldKlass("Password", field, alias),
  Time: (field, alias) => new FieldKlass("Time", field, alias),
  Date: (field, alias) => new FieldKlass("Date", field, alias),
  Bool: (field, alias) => new FieldKlass("Bool", field, alias),
};
export const Schema = (model, pk) => new SchemaKlass(model, pk);
