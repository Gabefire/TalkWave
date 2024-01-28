const createWebsocket = (channelType: string, channelId: string, userToken: string) => {
    return new WebSocket(
        `${import.meta.env.VITE_WEB_SOCKET_URL}/api/Message/${channelType}/${
          channelId
        }?authorization=${userToken}`
      );
}

export default createWebsocket