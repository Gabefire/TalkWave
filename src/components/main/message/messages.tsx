import { useContext, useEffect, useRef, useState } from "react";
import {
  channelType,
  messageType,
  messageTypeDto,
} from "../../../types/messages";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import MessageBody from "./message_body";

import "./messages.css";
import { useNavigate, useParams } from "react-router-dom";

import { AuthContext } from "../../../authProvider";
import axios from "axios";
import createWebsocket from "./createWebsocket";

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
  const [messageResults, setMessageResults] = useState([] as messageType[]);
  const [isLoading, setIsLoading] = useState(true);
  const [channel, setChannel] = useState({} as channelType);

  const navigate = useNavigate();

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
        setIsConnected(true);
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

          const message: messageType = {
            isOwner: result.IsOwner,
            author: result.Author,
            content: result.Content,
            createdAt: result.CreatedAt,
          };
          setMessageResults((previous) => [...previous, message]);
        });
      };
    };

    const setUpChannel = async () => {
      try {
        const results = await Promise.all([
          (await axios.get<messageType[]>(`/api/Message/${params.id}`)).data,
          (await axios.get<channelType>(`/api/Channel/${params.id}`)).data,
        ]);

        setChannel(results[1]);
        setMessageResults(results[0]);
        setUpWebSocket();
        setTimeout(() => setIsLoading(false), 500);
      } catch (error) {
        console.log(error);
      }
    };
    setIsLoading(true);
    setUpChannel();

    return () => {
      socket.current?.close();
    };
  }, [params, user.token]);

  const postMessage = async (message: string): Promise<boolean | void> => {
    try {
      socket.current?.send(message);
      setIsLoading(false);
    } catch (error) {
      // todo better error handler
      console.error(error);
    }
  };

  const deleteChannel = async () => {
    try {
      await axios.delete(`/api/Channel/${params.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      navigate("/main");
    }
  };

  const leaveChannel = async () => {
    try {
      if (params.type == "user") {
        throw new Error("invalid operation");
      } else {
        await axios.put(`/api/GroupChannel/leave/${params.id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      navigate("/main");
    }
  };

  const onSubmit: SubmitHandler<sendMessageFormSchemaType> = async ({
    message,
  }) => {
    // Might add a way to not get the websocket message here and just add it directly. timing might be off. Saves resources
    setIsLoading(true);
    await postMessage(message);

    setFocus("message");
    reset();
  };

  // to do better no info comp
  if (!params && !isConnected) {
    return (
      <>
        <div>Bad Connection</div>
      </>
    );
  }

  return (
    <div className="message-body">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="messages-top-bar">
            <h2>{channel.name}</h2>
            {channel.isOwner || params.type == "user" ? (
              <button
                className="message-header-btn delete"
                onClick={deleteChannel}
              >
                Delete
              </button>
            ) : (
              <button
                className="message-header-btn leave"
                onClick={leaveChannel}
              >
                Leave
              </button>
            )}
          </div>
          <MessageBody messageResults={messageResults} />
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
