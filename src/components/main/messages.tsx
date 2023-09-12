import { useContext, useEffect, useState } from "react";
import { messageResultType } from "../../types/messages";
import { MessageQueryContext } from "./App";

function Messages() {
  const messageQuery = useContext(MessageQueryContext);

  const [messageResults, setMessageResults] = useState({} as messageResultType);

  useEffect(() => {
    const fetchMessageInfo = () => {
      console.log("test");
      try {
        //fetch messages call
        console.log(messageQuery);
        const results: messageResultType = {
          title: "gabe",
          type: "group",
          owner: true,
          messages: [
            {
              from: "gabe",
              content: "Hi this is Gabe",
              date: new Date(),
              owner: true,
            },
            {
              from: "ben",
              content: "Hi this is ben",
              date: new Date(),
              owner: false,
            },
            {
              from: "leah",
              content: "Hi this is Leah",
              date: new Date(),
              owner: false,
            },
          ],
        };
        setMessageResults(results);
      } catch (error) {
        // to do better error handler probably to a different page
        console.error(error);
      }
    };
    fetchMessageInfo();
  }, [messageQuery]);

  return (
    <div className="messages">
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
                post.owner ? { marginLeft: "auto" } : { marginRight: "auto" }
              }
              key={`message-${index}`}
            >
              {/* toDo add better date */}
              <h5
                className="message-header"
                style={
                  post.owner ? { marginRight: "auto" } : { marginLeft: "auto" }
                }
              >{`${post.from} ${post.date}`}</h5>
              <p>{post.content}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Messages;
