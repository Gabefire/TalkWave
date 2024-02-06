import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { groupChannelDto } from "../../../types/messages";
import { useNavigate } from "react-router-dom";

const sendGroupChannelFormSchema = z.object({
  name: z.string().min(1),
});

type sendGroupChannelFormSchemaType = z.infer<
  typeof sendGroupChannelFormSchema
>;

function CreateGroup() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<sendGroupChannelFormSchemaType>({
    resolver: zodResolver(sendGroupChannelFormSchema),
  });

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<sendGroupChannelFormSchemaType> = async ({
    name,
  }) => {
    try {
      const results = (
        await axios.post<groupChannelDto>("/api/GroupChannel", {
          name,
          channelPicLink: "",
        })
      ).data;
      await axios.put(`/api/GroupChannel/join/${results.channelId}`);
      reset();
      navigate(`/main/group/${results.channelId}`);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <form className="modal" onSubmit={handleSubmit(onSubmit)}>
        <h3>Create Group</h3>
        <div className="inputs">
          <label htmlFor="channel-name">
            Name
            <input type="text" id="channel-name" {...register("name")} />
          </label>
          <button disabled={isSubmitting}>Submit</button>
        </div>
        <div>
          Groups are where conversations happen around a topic. Use a name that
          is easy to find and understand.
        </div>
      </form>
    </>
  );
}

export default CreateGroup;
