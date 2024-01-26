import { useContext, useEffect, useState } from "react";
import { messageType } from "../../../types/messages";
import { MessageQueryContext } from "../main_root";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import MessageBody from "./message_body";

import "./messages.css";
import { useParams } from "react-router-dom";

import { AuthContext } from "../../../authProvider";

// Types
const sendMessageFormSchema = z.object({
  message: z.string().min(1),
});

type sendMessageFormSchemaType = z.infer<typeof sendMessageFormSchema>;

// Message Component
function Messages() {
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { isSubmitting },
  } = useForm<sendMessageFormSchemaType>({
    resolver: zodResolver(sendMessageFormSchema),
  });

  const [socket, setSocket] = useState(null as null | WebSocket);
  const [isConnected, setIsConnected] = useState(false);
  const [messageResults, setMessageResults] = useState([] as messageType[]);
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();

  const user = useContext(AuthContext);

  const messageQuery = useContext(MessageQueryContext);

  useEffect(() => {
    const socket = new WebSocket(
      `${import.meta.env.VITE_WEB_SOCKET_URL}/api/Message/${params.type}/${
        params.id
      }?authorization=${user.token}`
    );
    setSocket(socket);
  }, [params, user.token]);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onMessageReceive = (message: messageType) => {
      console.log(message);
      setMessageResults((previous) => [...previous, message]);
    };

    const handleErrors = (err: Event) => {
      console.log(err);
    };

    socket?.addEventListener("open", (event) => {
      onConnect();
      console.log(event);
    });

    socket?.addEventListener("message", (event) => {
      (event.data as Blob).text().then((resultString) => {
        const result = JSON.parse(resultString);
        onMessageReceive(result as messageType);
      });
    });

    socket?.addEventListener("error", (event) => {
      handleErrors(event);
    });

    socket?.addEventListener("close", () => {
      onDisconnect();
    });

    return () => {
      socket?.removeEventListener("open", () => {
        onConnect();
      });

      socket?.removeEventListener("message", (event) => {
        onMessageReceive(event.data);
      });

      socket?.removeEventListener("error", (event) => {
        handleErrors(event);
      });

      socket?.removeEventListener("close", () => {
        onDisconnect();
      });
    };
  }, [socket]);

  const postMessage = async (message: string): Promise<boolean | void> => {
    try {
      socket?.send(message);
      return true;
    } catch (error) {
      // todo better error handler
      console.error(error);
    } finally {
      setFocus("message");
    }
  };

  const onSubmit: SubmitHandler<sendMessageFormSchemaType> = async ({
    message,
  }) => {
    setIsLoading(true);
    const results = await postMessage(message);
    if (results) {
      setMessageResults((prev) => [
        ...prev,
        {
          from: user.userName,
          content: message,
          date: new Date(),
          owner: true,
        } as messageType,
      ]);
    }
    reset();
  };

  // to do better no info comp
  if (!messageQuery.name && !messageQuery.type) {
    return (
      <>
        <div>No information</div>
      </>
    );
  }

  return (
    <>
      <div className="message-body">
        {isLoading ? (
          <div>No Messages Found</div>
        ) : (
          <MessageBody messageResults={messageResults} />
        )}
      </div>
      <form className="send-message" onSubmit={handleSubmit(onSubmit)}>
        <textarea
          aria-label="message"
          rows={4}
          cols={50}
          className="message-input"
          id="message-input"
          {...register("message")}
        />
        <button
          type="submit"
          className="submit-message-btn"
          disabled={isSubmitting}
        >
          Send
        </button>
      </form>
    </>
  );
}

export default Messages;
