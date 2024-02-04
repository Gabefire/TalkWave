export interface webSocketContextType<messageType> {
    createWebsocket: (url: string) => void,
    post: (message: string) => void,
    close: () => void,
    message: null | messageType,
    errors: null | string,
    connected: boolean,
  }
  