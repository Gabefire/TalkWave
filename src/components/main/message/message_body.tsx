import { useEffect, useRef, useState } from "react";
import { channelType, messageType } from "../../../types/messages";
import { useNavigate, useParams } from "react-router-dom";
import dateConverter from "../dateConverter";
import axios from "axios";

interface messageBodyType {
  messageResults: messageType[];
}

export default function MessageBody({ messageResults }: messageBodyType) {
  const [channel, setChannel] = useState({} as channelType);

  const navigate = useNavigate();

  const params = useParams();

  const dummy = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getChannel = async () => {
      try {
        const channel = (
          await axios.get<channelType>(`/api/Channel/${params.id}`)
        ).data;
        setChannel(channel);
      } catch (error) {
        console.log(error);
      }
    };
    getChannel();
  }, [params]);

  useEffect(() => {
    dummy.current?.scrollIntoView({
      behavior: "instant",
      block: "nearest",
      inline: "start",
    });
  }, [messageResults]);

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

  return (
    <>
      <div className="messages-top-bar">
        <h2>{channel.name}</h2>
        {channel.isOwner || params.type == "user" ? (
          <button className="message-header-btn delete" onClick={deleteChannel}>
            Delete
          </button>
        ) : (
          <button className="message-header-btn leave" onClick={leaveChannel}>
            Leave
          </button>
        )}
      </div>
      <div className="main-message-content">
        {messageResults.length === 0
          ? "No Messages Found"
          : messageResults.map((post, index) => {
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
    </>
  );
}
