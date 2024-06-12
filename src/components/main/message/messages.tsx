import { useContext, useEffect, useState } from "react";
import { messageType, messageWSDto } from "../../../types/messages.ts";
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
  const [message, setMessage] = useState(null as null | messageType);

  const params = useParams();
  const user = useContext(AuthContext);

  useEffect(() => {
    const createHubConnection = async () => {
      const connection = new signalR.HubConnectionBuilder()
        .withUrl(`${import.meta.env.VITE_WEB_SOCKET_URL}/api/Message`, {
          accessTokenFactory: () => user.token as string,
        })
        .withAutomaticReconnect()
        .build();
      connection.onclose = () => setIsConnected(false);
      connection.on(
        "ReceiveMessage",
        // special type for WS messages since I need to know who is owner client side
        (userId: number, message: messageWSDto) => {
          setMessage({
            author: message.author,
            content: message.content,
            createdAt: message.createdAt,
            isOwner: userId.toString() === user.userId,
          });
        }
      );
      await connection
        .start()
        .then(() => connection.invoke("JoinGroup", params.id))
        .then(() => {
          setIsConnected(true);
          setConnection(connection);
        });
    };
    createHubConnection();
    return () => {
      if (connection) {
        connection.stop();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const postMessage = async (message: string): Promise<void> => {
    try {
      if (connection) {
        connection.send("SendMessage", params.id, message);
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
