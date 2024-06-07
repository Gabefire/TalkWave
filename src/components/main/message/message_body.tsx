import { useEffect, useRef, useState } from "react";
import { messageType } from "../../../types/messages.ts";
import dateConverter from "../dateConverter.ts";
import axios from "axios";
import { useParams } from "react-router-dom";

interface MessageBodyType {
  message: null | messageType;
}

export default function MessageBody({ message }: MessageBodyType) {
  const dummy = useRef<HTMLSpanElement>(null);
  const scrollAble = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState([] as messageType[]);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const [messagesReceived, setMessagesReceived] = useState(false);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const result = (
          await axios.get<messageType[]>(`/api/Message/${params.id}`)
        ).data;
        console.log(result);
        setMessages(result);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getMessages();
    let scroller: HTMLDivElement;
    if (!scrollAble.current !== null) {
      scrollAble.current?.addEventListener("scrollend", () => {
        setMessagesReceived(true);
      });
      scroller = scrollAble.current as HTMLDivElement;
    }
    return () => {
      scroller.removeEventListener("scrollend", () => {
        setMessagesReceived(true);
      });
      setMessagesReceived(false);
    };
  }, [params]);

  useEffect(() => {
    if (message !== null) {
      setMessages((prev) => [...prev, message]);
    }
  }, [message]);

  useEffect(() => {
    messagesReceived
      ? dummy.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        })
      : dummy.current?.scrollIntoView({
          behavior: "instant",
          block: "end",
        });
  });

  return (
    <div
      className="main-message-content"
      ref={scrollAble}
      style={
        messagesReceived
          ? {
              overflowY: "auto",
            }
          : {
              overflowY: "hidden",
            }
      }
    >
      {!isLoading && messages.length === 0
        ? "No Messages Found"
        : messages.map((post, index) => {
            return (
              <div
                className="message"
                style={
                  post.isOwner
                    ? {
                        textAlign: "end",
                        alignSelf: "flex-end",
                        backgroundColor: "gray",
                      }
                    : {
                        textAlign: "start",
                        backgroundColor: "#007AFF",
                      }
                }
                key={`message-${index}`}
              >
                <div
                  className="message-header"
                  style={
                    post.isOwner
                      ? {
                          justifyContent: "flex-end",
                        }
                      : {
                          justifyContent: "start",
                        }
                  }
                >
                  <div className="from">{post.author}</div>
                  <div className="date-posted">
                    {dateConverter(post.createdAt)}
                  </div>
                </div>
                <p>{post.content}</p>
              </div>
            );
          })}
      <span ref={dummy}></span>
    </div>
  );
}
