import { useContext, useEffect, useRef, useState } from "react";
import { messageTypeDto } from "../../../types/messages";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import MessageBody from "./message_body";
import "./messages.css";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../contexts/authProvider";
import createWebsocket from "./createWebsocket";
import MessageHeader from "./message_header";
import { TailSpin } from "react-loader-spinner";

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
      let intervalId: number;
      socket.current.onopen = () => {
        setTimeout(() => setIsConnected(true), 1000);
        intervalId = setInterval(
          () => socket.current?.send(""),
          30000
        ) as unknown as number;
      };
      socket.current.onclose = () => {
        clearInterval(intervalId);
        setIsConnected(false);
      };
      socket.current.onerror = () => {
        setIsConnected(false);
        socket.current?.close();
        socket.current = null;
      };
      socket.current.onmessage = (event) => {
        (event.data as Blob).text().then((resultString) => {
          const result: messageTypeDto = JSON.parse(resultString);
          setMessage(result);
        });
      };
    };
    setUpWebSocket();
    window.ononline = () => {
      socket.current?.close();
      setUpWebSocket();
    };

    return () => {
      socket.current?.close();
    };
  }, [params, user.token]);

  const postMessage = async (message: string): Promise<boolean | void> => {
    try {
      socket.current?.send(message);
    } catch (error) {
      // todo better error handler
      console.error(error);
    }
  };

  const onSubmit: SubmitHandler<sendMessageFormSchemaType> = async ({
    message,
  }) => {
    // Might add a way to not get the websocket message here and just add it directly. timing might be off. Saves resources
    await postMessage(message);
    setFocus("message");
    reset();
  };

  return (
    <div className="message-body">
      {!isConnected ? (
        <TailSpin
          height="40"
          width="40"
          color="white"
          ariaLabel="tail-spin-loading"
          wrapperStyle={{}}
        />
      ) : (
        <>
          <MessageHeader />
          <MessageBody message={message} />
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
      )}
    </div>
  );
}

export default Messages;
