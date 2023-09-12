import React, { useContext, useEffect, useState } from "react";
import { messageResultType } from "../../types/messages";
import { MessageQueryContext } from "./App";

import MessageBody from "./message_body";

function Messages() {
  const messageQuery = useContext(MessageQueryContext);

  const [messageResults, setMessageResults] = useState({} as messageResultType);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMessageInfo = async () => {
      try {
        //fetch messages call
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
        setIsLoading(false);
      } catch (error) {
        // to do better error handler probably to a different page
        console.error(error);
      }
    };
    if (!messageQuery.type) {
      return;
    }
    fetchMessageInfo();
  }, [messageQuery]);

  return (
    <div className="messages">
      {isLoading ? (
        <div>No Messages Found</div>
      ) : (
        <MessageBody messageResults={messageResults} />
      )}
    </div>
  );
}

export default Messages;
