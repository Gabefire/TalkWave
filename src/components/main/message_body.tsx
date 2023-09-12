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
        <h1>{messageResults.title}</h1>
      </div>
      <div className="main-message-content">
        {messageResults.messages.map((post, index) => {
          return (
            <div
              className="message"
              style={
                post.owner
                  ? {
                      marginLeft: "auto",
                    }
                  : {
                      marginRight: "auto",
                    }
              }
              key={`message-${index}`}
            >
              {/* toDo add better date */}
              <h5
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
              >{`${post.from} ${post.date}`}</h5>
              <p>{post.content}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}
