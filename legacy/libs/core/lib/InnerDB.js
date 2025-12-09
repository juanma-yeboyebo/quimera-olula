import { util } from "..";

class InnerDbKlass {
  constructor(table) {
    this._table = table;
  }

  _readDb() {
    return util.getGlobalSetting(this._table);
  }

  _writeDb(value) {
    return util.setGlobalSetting(this._table, value);
  }

  _dictToArray(dict) {
    return Object.keys(dict).map(key => ({ ...dict[key], key }));
  }

  _arrayToDict(array) {
    return array.reduce((accum, item) => ({ ...accum, [item.key]: item }), {});
  }

  readAll() {
    return this._readDb() ?? {};
  }

  createRecord(key, value) {
    return this._writeDb({
      ...(this._readDb() ?? {}),
      [key]: value,
    });
  }

  readRecord(key) {
    const db = this._readDb();
    if (!db) {
      return {};
    }

    return db[key];
  }

  updateRecord(key, value) {
    const db = this._readDb() ?? {};

    return this._writeDb({
      ...db,
      [key]: {
        ...(db[key] ?? {}),
        ...value,
      },
    });
  }

  deleteRecord(key) {
    const db = this._readDb();
    if (!db) {
      return {};
    }

    delete db[key];

    return this._writeDb(db);
  }

  createMulti(records) {
    return this._writeDb({
      ...(this._readDb() ?? {}),
      ...records,
    });
  }

  readMulti(dbFilter, limit) {
    const db = this._readDb();
    if (!db) {
      return {};
    }

    const filteredRecords = this._dictToArray(db).filter(dbFilter);
    const limitedRecords = limit ? filteredRecords.slice(0, limit) : filteredRecords;

    return this._arrayToDict(limitedRecords);
  }

  updateMulti(dbFilter, dbUpdate) {
    const db = this._readDb() ?? {};

    const filteredRecords = this._dictToArray(db).filter(dbFilter);
    const updatedRecords = this._arrayToDict(filteredRecords.map(dbUpdate));

    return this._writeDb({ ...db, ...updatedRecords });
  }

  deleteMulti(dbFilter) {
    const db = this._readDb();
    if (!db) {
      return;
    }

    const filteredRecords = this._dictToArray(db).filter(item => !dbFilter(item));

    return this._writeDb(this._arrayToDict(filteredRecords));
  }
}

export const InnerDB = {
  table: tableName => new InnerDbKlass(tableName),
};
