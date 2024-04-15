import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { channelType, groupChannelDto } from "../../../types/messages";
import { useNavigate } from "react-router-dom";
import ChannelListContext from "../../../contexts/channelListContext";
import { useContext } from "react";
import { ACTION } from "../../../reducers/channelReducer";

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

  const { dispatch, changeLoading } = useContext(ChannelListContext);

  const onSubmit: SubmitHandler<sendGroupChannelFormSchemaType> = async ({
    name,
  }) => {
    try {
      changeLoading(true);
      const results = (
        await axios.post<groupChannelDto>("/api/GroupChannel", {
          name,
          channelPicLink: "",
        })
      ).data;
      await axios.put(`/api/GroupChannel/join/${results.channelId}`);
      reset();
      const channel: channelType = {
        name: results.name,
        type: "group",
        isOwner: true,
        channelId: results.channelId,
        channelPicLink: results.channelPicLink,
      };
      dispatch({
        type: ACTION.ADD_CHANNELS,
        payload: {
          channels: [channel],
        },
      });
      navigate(`/main/group/${results.channelId}`);
    } catch (error) {
      console.error(error);
    } finally {
      changeLoading(false);
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
          <button disabled={isSubmitting} className="modal-button">
            Submit
          </button>
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
