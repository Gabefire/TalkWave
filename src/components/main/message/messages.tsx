import { useContext, useEffect, useState } from "react";
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

import { AuthContext } from "../../../contexts/authProvider";
import axios from "axios";
import useWebSocket from "../../../hooks/useWebsocket";

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
  const [messageResults, setMessageResults] = useState([] as messageType[]);
  const [isLoading, setIsLoading] = useState(true);
  const [channel, setChannel] = useState({} as channelType);

  const navigate = useNavigate();

  const params = useParams();
  const user = useContext(AuthContext);
  const { connected, errors, message, post } = useWebSocket<messageTypeDto>(
    `${import.meta.env.VITE_WEB_SOCKET_URL}/api/Message/${params.type}/${
      params.id
    }?authorization=${user.token}`
  );

  useEffect(() => {
    const setUpChannel = async () => {
      try {
        const results = await Promise.all([
          (await axios.get<messageType[]>(`/api/Message/${params.id}`)).data,
          (await axios.get<channelType>(`/api/Channel/${params.id}`)).data,
        ]);
        setChannel(results[1]);
        setMessageResults(results[0]);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    setUpChannel();
  }, [params, user.token]);

  useEffect(() => {
    if (errors) {
      console.log(errors);
    }
  }, [errors]);

  useEffect(() => {
    if (message) {
      setMessageResults((prev) => [
        ...prev,
        {
          isOwner: message.IsOwner,
          author: message.Author,
          content: message.Content,
          createdAt: message.CreatedAt,
        },
      ]);
    }
  }, [message]);

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
    post(message);
    setFocus("message");
    reset();
  };

  // to do better no info comp
  if (!params && !connected) {
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
