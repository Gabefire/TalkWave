import { useContext, useEffect, useState } from "react";
import { messageTypeDto } from "../../../types/messages";
import MessageBody from "./message_body";
import "./messages.css";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../contexts/authProvider";
import MessageHeader from "./message_header";
import { TailSpin } from "react-loader-spinner";
import MessageSend from "./message_send";

function Messages() {
  const [socket, setSocket] = useState(null as null | WebSocket);
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState(null as null | messageTypeDto);

  const params = useParams();
  const user = useContext(AuthContext);
  useEffect(() => {
    const socket = new WebSocket(
      `${import.meta.env.VITE_WEB_SOCKET_URL}/api/Message/${params.type}/${
        params.id
      }?authorization=${user.token}`
    );

    socket.onopen = () => {
      setTimeout(() => setIsConnected(true), 1000);
    };
    socket.onclose = () => {
      setIsConnected(false);
    };
    socket.onerror = () => {
      setIsConnected(false);
      socket.close();
    };
    socket.onmessage = (event) => {
      (event.data as Blob).text().then((resultString) => {
        const result: messageTypeDto = JSON.parse(resultString);
        setMessage(result);
      });
    };

    const intervalId = setInterval(
      () => socket.send(""),
      60000
    ) as unknown as number;

    setSocket(socket);
    return () => {
      clearInterval(intervalId);
      socket.close();
    };
  }, [params, user.token]);

  const postMessage = async (message: string): Promise<void> => {
    try {
      if (socket) {
        socket.send(message);
      }
    } catch (error) {
      // todo better error handler
      console.error(error);
    }
  };

  return (
    <div className="message-body">
      {!isConnected && message === null ? (
        <TailSpin
          height="40"
          width="40"
          color="white"
          ariaLabel="tail-spin-loading"
          wrapperClass="load"
        />
      ) : (
        <>
          <MessageHeader />
          <MessageBody message={message} />
          <MessageSend post={postMessage} />
        </>
      )}
    </div>
  );
}

export default Messages;
