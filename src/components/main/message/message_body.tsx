import { useContext } from "react";
import { messageResultType } from "../../../types/messages";
import { MessageQueryContext } from "../main_root";
import { useNavigate } from "react-router-dom";
import dateConverter from "../dateConverter";

interface messageBodyType {
  messageResults: messageResultType;
}

export default function MessageBody({ messageResults }: messageBodyType) {
  const messageQuery = useContext(MessageQueryContext);

  const navigate = useNavigate();

  const deleteGroup = async () => {
    // api call to delete message query
    navigate("/main");
    console.log(messageQuery);
  };

  const leaveGroup = async () => {
    // api call to leave message query
    navigate("/main");
    console.log(messageQuery);
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
                  <div
                    className="message-header"
                    style={
                      post.owner
                        ? {
                            justifyContent: "flex-end",
                          }
                        : {
                            justifyContent: "start",
                          }
                    }
                  >
                    <div className="from">{post.from}</div>
                    <div className="date-posted">
                      {dateConverter(post.date)}
                    </div>
                  </div>
                  <p>{post.content}</p>
                </div>
              );
            })}
      </div>
    </>
  );
}
