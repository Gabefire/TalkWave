import { useContext, useEffect, useState } from "react";
import { messageType, messageTypeDto } from "../../../types/messages";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import MessageBody from "./message_body";

import "./messages.css";
import { useParams } from "react-router-dom";

import { AuthContext } from "../../../authProvider";
import axios from "axios";

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

  useEffect(() => {
    const connectWebsocket = async () => {
      const socket = new WebSocket(
        `${import.meta.env.VITE_WEB_SOCKET_URL}/api/Message/${params.type}/${
          params.id
        }?authorization=${user.token}`
      );
      setSocket(socket);
    };

    const getMessages = async () => {
      try {
        const messages = await axios.get<messageType[]>(
          `/api/Message/${params.id}`
        );
        setMessageResults(messages.data);
        await connectWebsocket();
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    getMessages();
  }, [params, user.token]);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
      setIsLoading(false);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const handleErrors = (err: Event) => {
      console.log(err);
    };

    socket?.addEventListener("open", () => {
      onConnect();
    });

    socket?.addEventListener("message", (event) => {
      (event.data as Blob).text().then((resultString) => {
        const result: messageTypeDto = JSON.parse(resultString);

        const message: messageType = {
          isOwner: result.IsOwner,
          author: result.Author,
          content: result.Content,
          createdAt: result.CreatedAt,
        };

        setMessageResults((previous) => [...previous, message]);
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
        (event.data as Blob).text().then((resultString) => {
          const result: messageType = JSON.parse(resultString);
          setMessageResults((previous) => [...previous, result]);
        });
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
    await postMessage(message);
    setIsLoading(false);
    reset();
  };

  // to do better no info comp
  if (!params || !isConnected) {
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
