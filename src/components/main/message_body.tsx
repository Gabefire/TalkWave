import { messageResultType } from "../../types/messages";

interface messageBodyType {
  messageResults: messageResultType;
}

export default function MessageBody({ messageResults }: messageBodyType) {
  return (
    <>
      <div className="topBar">
        {messageResults.owner ? (
          <button className="message-header-btn delete">Delete</button>
        ) : (
          <button className="message-header-btn leave">Leave</button>
        )}
        <h2>{messageResults.title}</h2>
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
                        }
                      : {
                          textAlign: "start",
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
