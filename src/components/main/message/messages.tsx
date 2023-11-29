import { useContext, useEffect, useState } from "react";
import { messageResultType, messageType } from "../../../types/messages";
import { MessageQueryContext } from "../main_root";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import MessageBody from "./message_body";

import "./messages.css";

const sendMessageFormSchema = z.object({
  message: z.string().min(1),
});

type sendMessageFormSchemaType = z.infer<typeof sendMessageFormSchema>;

function Messages() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<sendMessageFormSchemaType>({
    resolver: zodResolver(sendMessageFormSchema),
  });

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

  const postMessage = async (message: string): Promise<void | messageType> => {
    // API call to post message
    try {
      console.log(message);
      return {
        from: "gabe",
        content: message,
        date: new Date(),
        owner: true,
      };
    } catch (error) {
      // toDO better error handler
      console.error(error);
    }
  };

  const onSubmit: SubmitHandler<sendMessageFormSchemaType> = async ({
    message,
  }) => {
    // POST message add message to array if success
    const results = await postMessage(message);
    if (results) {
      setMessageResults((prev) => {
        return {
          ...prev,
          messages: [...prev.messages, results],
        };
      });
    }
  };

  // to do better no info comp
  if (!messageQuery.name && !messageQuery.type) {
    return (
      <>
        <div>No information</div>
      </>
    );
  }

  return (
    <>
      <div className="message-body">
        {isLoading ? (
          <div>No Messages Found</div>
        ) : (
          <MessageBody messageResults={messageResults} />
        )}
      </div>
      <form className="send-message" onSubmit={handleSubmit(onSubmit)}>
        <textarea
          aria-label="message"
          rows={4}
          cols={50}
          className="message-input"
          id="message-input"
          {...register("message")}
        />
        <button
          type="submit"
          className="submit-message-btn"
          disabled={isSubmitting}
        >
          Send
        </button>
      </form>
    </>
  );
}

export default Messages;
