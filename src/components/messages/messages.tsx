import { useEffect, useState } from "react";
import { messageType } from "../../types/messages";

interface messagesQueryType {
  messagesQuery: { name: string; type: "group" | "user" };
}

function Messages({ messagesQuery }: messagesQueryType) {
  const [messageArray, setMessageArray] = useState([] as messageType[]);
  useEffect(() => {
    const fetchMessageInfo = async () => {
      try {
        //fetch messages call
        console.log(messagesQuery);
        const results: messageType[] = [
          {
            from: "gabe",
            content: "Hi this is Gabe",
            date: new Date(),
          },
          {
            from: "ben",
            content: "Hi this is ben",
            date: new Date(),
          },
          {
            from: "leah",
            content: "Hi this is Leah",
            date: new Date(),
          },
        ];
        setMessageArray(results);
      } catch (error) {
        // to do better error handler probably to a different page
        console.error(error);
      }
    };
    fetchMessageInfo();
  }, [messagesQuery]);

  return (
    <>
      <Header />
      <MainMessages />
    </>
  );
}

export default Messages;
