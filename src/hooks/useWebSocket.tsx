import { useEffect, useState } from "react";

export default function useWebSocket<messageType>(url: string) {
  const [socket, setSocket] = useState(null as null | WebSocket);
  const [connected, setConnected] = useState(false);
  const [errors, setErrors] = useState(null as null | Event);
  const [message, setMessage] = useState(null as null | messageType);

  useEffect(() => {
    const webSocket = new WebSocket(url);
    webSocket.onopen = () => {
      setConnected(true);
    };
    webSocket.onclose = () => {
      setConnected(false);
    };
    webSocket.onerror = (event: Event) => {
      setErrors(event);
    };
    webSocket.onmessage = (event) => {
      (event.data as Blob).text().then((resultString) => {
        const result: messageType = JSON.parse(resultString);
        setMessage(result);
      });
    };
    setInterval(() => webSocket.send(""), 120000);
    setSocket(webSocket);
    return () => {
      webSocket.close();
    };
  }, [url]);

  const post = (message: string) => {
    if (socket !== null) {
      socket.send(message);
    }
  };

  const close = () => {
    if (socket !== null && connected) {
      socket.close();
    }
  };

  return {
    connected,
    errors,
    message,
    post,
    close,
  };
}
