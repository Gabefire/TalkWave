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
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState(null as null | messageType);

  const params = useParams();
  const user = useContext(AuthContext);

  const url = window.location.pathname.split("/").pop();

  const postMessage = async (message: string): Promise<void> => {
    try {
      if (connectionRef) {
        connectionRef.send("SendMessage", params.id, message);
      }
    } catch (error) {
      // todo better error handler
      console.error(error);
    }
  };

  const [connectionRef, setConnection] = useState<signalR.HubConnection>();

  function createHubConnection(userToken: string) {
    const hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_WEB_SOCKET_URL}/api/Message`, {
        accessTokenFactory: () => userToken,
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .configureLogging(signalR.LogLevel.Debug)
      .build();
    setConnection(hubConnection);
  }

  useEffect(() => {
    if (user.token) createHubConnection(user.token);
  }, [url, user]);

  useEffect(() => {
    if (connectionRef) {
      connectionRef.start().then(() => {
        setIsConnected(true);
        connectionRef.on(
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

        connectionRef.onclose(() => {
          setIsConnected(false);
        });
        connectionRef.onreconnected(() => {
          if (connectionRef) connectionRef.invoke("JoinGroup", params.id);
        });

        connectionRef.invoke("JoinGroup", params.id);
      });
    }

    return () => {
      if (connectionRef) connectionRef.stop();
    };
  }, [connectionRef]);

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
