import { useEffect, useRef } from "react";
import { messageType } from "../../../types/messages";
import dateConverter from "../dateConverter";

interface messageBodyType {
  messageResults: messageType[];
}

export default function MessageBody({ messageResults }: messageBodyType) {
  const dummy = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    dummy.current?.scrollIntoView({
      behavior: "instant",
      block: "end",
    });
  }, [messageResults]);

  return (
    <>
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
