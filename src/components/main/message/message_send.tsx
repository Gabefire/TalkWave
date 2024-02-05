import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface MessageSendType {
  post: (message: string) => Promise<void>;
}

const sendMessageFormSchema = z.object({
  message: z.string().min(1),
});

type sendMessageFormSchemaType = z.infer<typeof sendMessageFormSchema>;

export default function MessageSend({ post }: MessageSendType) {
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { isSubmitting },
  } = useForm<sendMessageFormSchemaType>({
    resolver: zodResolver(sendMessageFormSchema),
  });

  const onSubmit: SubmitHandler<sendMessageFormSchemaType> = async ({
    message,
  }) => {
    // Might add a way to not get the websocket message here and just add it directly. timing might be off. Saves resources
    await post(message);
    setFocus("message");
    reset();
  };

  return (
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
  );
}
