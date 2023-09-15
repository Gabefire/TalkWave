import { useContext } from "react";
import { messageResultType, messageQueryType } from "../../types/messages";
import { MessageQueryContext } from "./App";

interface messageBodyType {
  messageResults: messageResultType;
  updateMessageQuery: (data: messageQueryType) => void;
}

export default function MessageBody({
  messageResults,
  updateMessageQuery,
}: messageBodyType) {
  const messageQuery = useContext(MessageQueryContext);
  const deleteGroup = async () => {
    // api call to delete message query
    console.log(messageQuery);
    updateMessageQuery({
      name: "",
      type: null,
    });
  };

  const leaveGroup = async () => {
    // api call to leave message query
    console.log(messageQuery);
    updateMessageQuery({
      name: "",
      type: null,
    });
  };
  return (
    <>
      <div className="messages-top-bar">
        <h2>{messageResults.title}</h2>
        {messageResults.owner ? (
          <button className="message-header-btn delete" onClick={deleteGroup}>
            Delete
          </button>
        ) : (
          <button className="message-header-btn leave" onClick={leaveGroup}>
            Leave
          </button>
        )}
      </div>
      <div className="main-message-content">
        {messageResults.messages.length === 0
          ? "No Messages Found"
          : messageResults.messages.map((post, index) => {
              return (
                <div
                  className="message"
                  style={
                    post.owner
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
                  {/* toDo add better date */}
                  <h6
                    className="message-header"
                    style={
                      post.owner
                        ? {
                            marginRight: "auto",
                          }
                        : {
                            marginLeft: "auto",
                          }
                    }
                  >{`${post.from} ${post.date}`}</h6>
                  <p>{post.content}</p>
                </div>
              );
            })}
      </div>
    </>
  );
}
