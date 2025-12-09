import $ from "jquery";

import util from "../util";

const getBaseUrl = api => {
  const env = util.getEnvironment();

  return api && api !== "default" ? env.getUrlDict()?.[api] : env.getAPIUrl();
};

const APIFileCall = async (_method, apiUrl, data, filename, success, error, api) => {
  const token = util.getUserToken();
  const [requestParams] = data;
  const baseUrl = getBaseUrl(api);
  const url = requestParams
    ? `${baseUrl}${apiUrl}?${$.param(requestParams)}`
    : `${baseUrl}${apiUrl}`;
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token,
    },
  })
    .then(response => {
      if (response.ok) {
        return response.blob().then(blob => {
          const isPdf = filename.endsWith(".pdf");
          if (isPdf) {
            blob = new Blob([blob], { type: "application/pdf" });
          }
          const blobUrl = window.URL.createObjectURL(blob);
          if (isPdf) {
            window.open(blobUrl, "_blank");
          } else {
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = blobUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
          }
        });
      }
      response.text().then(errorText => error(errorText));
    })
    .catch(errorResponse => {
      const message = "message" in errorResponse ? errorResponse.message : errorResponse;
      error(message);
    });
};

const APIFileUpload = async (method, apiUrl, _data, files, success, error, api) => {
  const token = util.getUserToken();
  const baseUrl = getBaseUrl(api);
  const url = `${baseUrl}${apiUrl}`;

  const fetchData = {
    method,
    headers: {
      Authorization: token,
    },
  };
  const fd = new FormData();
  fd.append("files", files);
  fetchData.body = fd;

  fetch(url, fetchData)
    .then(response => {
      if (response.ok) {
        const responseData = response.json();
        success(responseData);
      } else {
        const errorText = response.text();
        error(errorText);
      }
    })
    .catch(errorResponse => {
      const message = "message" in errorResponse ? errorResponse.message : errorResponse;
      error(message);
    });
};
const urlNeedsLogin = url => {
  const loginUrls = ["login", "forgot_password", "check_hashlink", "create_user", "public"];
  const firstWord = url.split("/")[0];

  return !loginUrls.includes(firstWord);
};

const APICall = async (method, apiUrl, data, success, error, api) => {
  const token = util.getUserToken();
  const [requestParams, requestData] = data;
  let baseUrl = getBaseUrl(api);

  const hasFiles = "FILES" in requestData;
  const fetchData = {
    method,
    headers: {
      "Content-Type": hasFiles ? "multipart/form-data" : "application/json",
      "Authorization": token,
    },
  };

  if (!urlNeedsLogin(apiUrl)) {
    const splittedBaseUrl = baseUrl.split("/");
    baseUrl = splittedBaseUrl.slice(0, splittedBaseUrl.length - 2);
    baseUrl = `${baseUrl.join("/")}/`;
  }
  if (baseUrl === "" || !urlNeedsLogin(apiUrl)) {
    delete fetchData.headers["Content-Type"];
    delete fetchData.headers.Authorization;
  }

  const url = requestParams
    ? `${baseUrl}${apiUrl}?${$.param(requestParams)}`
    : `${baseUrl}${apiUrl}`;

  if (method !== "GET") {
    if (hasFiles) {
      const { FILES, ...rD } = requestData;
      const formData = new FormData();
      for (const key in rD) {
        formData.append(key, rD[key]);
      }
      for (let i = 0; i < FILES.length; i++) {
        formData.append(`file${i.toString()}`, FILES[i]);
      }
      fetchData.body = formData;
      delete fetchData.headers["Content-Type"];
    } else {
      fetchData.body = JSON.stringify(requestData);
    }
  }

  fetch(url, fetchData)
    .then(response => {
      if (response.ok) {
        response.json().then(responseData => success(responseData));
      } else {
        response.text().then(errorText => {
          try {
            const errorDict = JSON.parse(errorText);
            error(errorDict.error);
          } catch {
            error(errorText);
          }
        });
      }
    })
    .catch(errorResponse => {
      const message = "message" in errorResponse ? errorResponse.message : errorResponse;
      error(message);
    });
};

class QueryRunner {
  defSuccess = (next, dispatch) => res => {
    dispatch({
      type: next,
      payload: res,
    });
  };

  defError = (next, dispatch) => res => {
    dispatch({
      type: "onError",
      payload: {
        type: next,
        error: res,
      },
    });
  };

  run(url, params, next, dispatch, api) {
    const success = this.success ? this.success : this.defSuccess(next, dispatch);
    const error = this.error ? this.error : this.defError(next, dispatch);

    if (this.method === "GET") {
      APICall(this.method, url, params.extractGet(), success, error, api);
    } else {
      APICall(this.method, url, params.extractPost(), success, error, api);
    }
  }

  download(url, params, next, filename, dispatch, api) {
    const success = this.success ? this.success : this.defSuccess(next, dispatch);
    const error = this.error ? this.error : this.defError(next, dispatch);

    if (this.method === "GET") {
      APIFileCall(this.method, url, params.extractGet(), filename, success, error, api);
    } else {
      APIFileCall(this.method, url, params.extractPost(), filename, success, error, api);
    }
  }

  upload(url, params, next, files, dispatch, api) {
    const success = this.success ? this.success : this.defSuccess(next, dispatch);
    const error = this.error ? this.error : this.defError(next, dispatch);

    if (this.method === "GET") {
      APIFileUpload("POST", url, params.extractPost(), files, success, error, api);
    } else {
      APIFileUpload(this.method, url, params.extractPost(), files, success, error, api);
    }
  }
}

class QueryParams {
  select = null;
  filter = null;
  order = null;
  page = null;
  extra = {};

  extract() {
    let params = {};
    params = this.select ? { ...params, fields: this.select } : params;
    params = this.filter ? { ...params, filter: JSON.stringify(this.filter) } : params;
    params = this.order ? { ...params, order: this.order } : params;
    params = this.page ? { ...params, page: JSON.stringify(this.page) } : params;

    return [params, this.extra];
  }

  extractGet() {
    let params = {};
    params = this.select ? { ...params, fields: this.select } : params;
    params = this.filter ? { ...params, filter: JSON.stringify(this.filter) } : params;
    params = this.order ? { ...params, order: this.order } : params;
    params = this.page ? { ...params, page: JSON.stringify(this.page) } : params;
    params = { ...params, ...this.extra };

    return [params, {}];
  }

  extractPost() {
    // let params = {}
    // params = this.select ? { ...params, fields: this.select } : params
    // params = this.filter ? { ...params, filter: JSON.stringify(this.filter) } : params
    // params = this.order ? { ...params, order: JSON.stringify(this.order) } : params
    // params = this.page ? { ...params, page: JSON.stringify(this.page) } : params

    return [{}, this.extra];
  }
}

class RestQuery {
  constructor(model) {
    this._model = model;
    this._url = `${this._model}`;
    this._api = "default";
    this._params = new QueryParams();
    this._runner = new QueryRunner();
  }

  get(value, action) {
    this._runner.method = "GET";
    this._url = value ? `${this._model}/${this._escapeValue(value)}` : `${this._model}`;
    this._url = action ? `${this._url}/${action}` : `${this._url}`;
    return this;
  }

  post(params, action) {
    this._runner.method = "POST";
    this._url = action ? `${this._url}/-static-/${action}` : `${this._url}`;
    if (params) {
      this._params.extra = params;
    }

    return this;
  }

  put(params) {
    this._runner.method = "PUT";
    this._params.extra = params;

    return this;
  }

  _escapeValue(value) {
    return value && typeof value === "string"
      ? encodeURIComponent(value.replace("/", "{Slash}").replace(".", "YBPointYB"))
      : value;
  }

  patch(pk, action) {
    this._runner.method = "PATCH";
    this._url = `${this._model}/${this._escapeValue(pk)}`;
    this._url = action ? `${this._url}/${action}` : `${this._url}`;

    return this;
  }

  delete(pk) {
    this._runner.method = "DELETE";
    this._url = `${this._model}/${this._escapeValue(pk)}`;

    return this;
  }

  setKeys(keys) {
    this._params.extra = keys;

    return this;
  }

  set(key, value) {
    this._params.extra[key] = value;

    return this;
  }

  api(value) {
    this._api = value;

    return this;
  }

  select(select) {
    this._params.select = select;

    return this;
  }

  filter(filter) {
    this._params.filter = filter;

    return this;
  }

  setFiles(files) {
    this._params.extra.FILES = files;

    return this;
  }

  page(page) {
    this._params.page = page;

    return this;
  }

  success(success) {
    this._runner.success = success;

    return this;
  }

  error(error) {
    this._runner.error = error;

    return this;
  }

  order(order) {
    this._params.order = order;

    return this;
  }

  go(next, dispatch) {
    this._runner.run(this._url, this._params, next, dispatch, this._api);
  }

  download(next, filename, dispatch) {
    this._runner.download(this._url, this._params, next, filename, dispatch, this._api);
  }

  upload(next, files, dispatch) {
    this._runner.upload(this._url, this._params, next, files, dispatch, this._api);
  }
}

export default model => new RestQuery(model);
