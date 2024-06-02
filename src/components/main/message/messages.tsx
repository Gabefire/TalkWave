import { useContext, useEffect, useState } from "react";
import { messageTypeDto } from "../../../types/messages.ts";
import MessageBody from "./message_body.tsx";
import "./messages.css";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../contexts/authProvider.tsx";
import MessageHeader from "./message_header.tsx";
import { TailSpin } from "react-loader-spinner";
import MessageSend from "./message_send.tsx";
import * as signalR from "@microsoft/signalr";

function Messages() {
  const [connection, setConnection] = useState(
    null as null | signalR.HubConnection
  );
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState(null as null | messageTypeDto);

  const params = useParams();
  const user = useContext(AuthContext);
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_WEB_SOCKET_URL}/api/Messages`, {
        accessTokenFactory: () => user.token as string,
      })
      .build();

    connection.on("open", () => {
      setTimeout(() => setIsConnected(true), 1000);
    });

    connection.onclose = () => {
      setIsConnected(false);
    };

    connection.on("ReceiveMessage,", (message) => {
      (message.data as Blob).text().then((resultString) => {
        const result: messageTypeDto = JSON.parse(resultString);
        setMessage(result);
      });
    });

    connection.start().then(() => connection.invoke("JoinGroup", params.id));

    setConnection(connection);
    return () => {
      connection.send("LeaveGroup", params.id).then(() => connection.stop());
    };
  }, [params, user.token]);

  const postMessage = async (message: string): Promise<void> => {
    try {
      if (connection) {
        connection.send("SendMessage", message);
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
