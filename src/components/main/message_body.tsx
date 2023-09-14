import { messageResultType } from "../../types/messages";

interface messageBodyType {
  messageResults: messageResultType;
}

export default function MessageBody({ messageResults }: messageBodyType) {
  return (
    <>
      <div className="messages-top-bar">
        <h2>{messageResults.title}</h2>
        {messageResults.owner ? (
          <button className="message-header-btn delete">Delete</button>
        ) : (
          <button className="message-header-btn leave">Leave</button>
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
