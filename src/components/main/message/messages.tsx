import { useContext, useEffect, useRef, useState } from "react";
import { messageTypeDto } from "../../../types/messages";
import MessageBody from "./message_body";
import "./messages.css";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../contexts/authProvider";
import createWebsocket from "./createWebsocket";
import MessageHeader from "./message_header";
import { TailSpin } from "react-loader-spinner";
import MessageSend from "./message_send";

function Messages() {
  const socket = useRef(null as null | WebSocket);
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState(null as null | messageTypeDto);

  const params = useParams();
  const user = useContext(AuthContext);
  useEffect(() => {
    const setUpWebSocket = () => {
      socket.current = createWebsocket(
        params.type as string,
        params.id as string,
        user.token as string
      );

      socket.current.onopen = () => {
        setTimeout(() => setIsConnected(true), 1000);
      };
      socket.current.onclose = () => {
        setIsConnected(false);
      };
      socket.current.onerror = () => {
        setIsConnected(false);
        socket.current?.close();
      };
      socket.current.onmessage = (event) => {
        (event.data as Blob).text().then((resultString) => {
          const result: messageTypeDto = JSON.parse(resultString);
          setMessage(result);
        });
      };
    };
    setUpWebSocket();
    const intervalId = setInterval(
      () => socket.current?.send(""),
      60000
    ) as unknown as number;
    window.ononline = () => {
      socket.current?.close();
      setUpWebSocket();
    };

    return () => {
      clearInterval(intervalId);
      socket.current?.close();
    };
  }, [params, user.token]);

  const postMessage = async (message: string): Promise<void> => {
    try {
      socket.current?.send(message);
    } catch (error) {
      // todo better error handler
      console.error(error);
    }
  };

  return (
    <>
      {!isConnected ? (
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
    </>
  );
}

export default Messages;
