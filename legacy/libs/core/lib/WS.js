import util from "../util";

const getBaseUrl = () => {
  const env = util.getEnvironment();

  return env.getAPIUrl();
};

const WSConnect = async (
  _next,
  channel,
  _dispatch,
  _data,
  _onMessage,
  _onConnect,
  _send,
  _error,
) => {
  // TODO pasar url como param si no queremos la de apiUrl
  const user = util.getUser();
  // var [requestParams, requestData] = data
  const apiUrlBase = getBaseUrl();
  const urlBase = apiUrlBase.startsWith("https")
    ? `wss${apiUrlBase.substring(5, apiUrlBase.length - 4)}`
    : `ws${apiUrlBase.substring(4, apiUrlBase.length - 4)}`;
  let url = channel ? `${urlBase}room/${channel}` : `${urlBase}room/user/${user.user}`;
  const token = user && user.token ? `?token=${user.token}` : false;
  if (token) {
    url += token;
  }
  // const socket = new WebSocket(url)
  // socket.onmessage = onMessage
  // socket.onopen = onConnect(socket, next, dispatch)
  // if (socket.readyState === WebSocket.OPEN) {
  //   socket.onopen()
  // }
};

class SocketRunner {
  defOnMessage = (next, dispatch) => res => {
    dispatch({
      type: `on${util.camelId(next)}Received`,
      payload: res,
    });
  };

  defOnConnect = (socket, next, dispatch) => res => {
    const payload = { socket, data: res };
    dispatch({
      type: `on${util.camelId(next)}Connect`,
      payload,
    });
  };

  defSend = (next, dispatch) => res => {
    dispatch({
      type: next,
      payload: res,
    });
  };

  defError = (next, dispatch) => res => {
    dispatch({
      type: `${next}Failed`,
      payload: res,
    });
  };

  connect(next, channel, params, dispatch) {
    const onMessage = this.onMessage ? this.onMessage : this.defOnMessage(next, dispatch);
    const onConnect = this.onConnect ? this.onConnect : this.defOnConnect;
    const send = this.send ? this.send : this.defSend(next, dispatch);
    const error = this.error ? this.error : this.defError(next, dispatch);
    WSConnect(next, channel, dispatch, params.extract(), onMessage, onConnect, send, error);
  }
}

class SocketParams {
  filter = null;
  extra = {};

  extract() {
    let params = {};
    params = this.filter ? { ...params, filter: JSON.stringify(this.filter) } : params;

    return [params, this.extra];
  }
}

class SocketManager {
  constructor(channel) {
    this._channel = channel;
    this._params = new SocketParams();
    this._runner = new SocketRunner();
  }

  connect(next, dispatch) {
    this._runner.connect(next, this._channel, this._params, dispatch);
  }

  onMessage(onMessageFunc) {
    this._runner.onMessage = onMessageFunc;

    return this;
  }

  onConnect(onConnectFunc) {
    this._runner.onConnect = onConnectFunc;

    return this;
  }

  send(sendObj) {
    this._runner.send = sendObj;

    return this;
  }

  error(error) {
    this._runner.error = error;

    return this;
  }
}

export default model => new SocketManager(model);
