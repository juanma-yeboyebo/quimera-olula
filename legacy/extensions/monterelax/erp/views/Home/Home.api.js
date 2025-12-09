export default parent =>
  class coreAPI extends parent {
    _onOpenSocket(socket, socker) {
      const message = {
        action: "start_sec3",
        job_name: "name",
      };
      socket.send(JSON.stringify(message));
    }

    _onWebSocketMessage(socker) {
      console.log(socker);
    }
  };
