import { useContext, useEffect, useState } from "react";
import { channelType } from "../../../types/messages";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ChannelListContext from "../../../contexts/channelListContext";
import { ACTION } from "../../../reducers/channelReducer";

export default function MessageHeader() {
  const [channel, setChannel] = useState<null | channelType>(null);

  const params = useParams();
  const navigate = useNavigate();
  const { dispatch, changeLoading } = useContext(ChannelListContext);

  useEffect(() => {
    const getChannels = async () => {
      try {
        const result = (
          await axios.get<channelType>(`/api/Channel/${params.id}`)
        ).data;
        setChannel(result);
      } catch (error) {
        console.log(error);
      }
    };
    getChannels();
  }, [params]);

  const deleteChannel = async () => {
    if (channel === null) return;
    try {
      changeLoading(true);
      await axios.delete(`/api/Channel/${params.id}`);
      dispatch({
        type: ACTION.DELETE_CHANNELS,
        payload: {
          channels: [channel],
        },
      });
    } catch (err) {
      console.error(err);
    } finally {
      changeLoading(false);
      navigate("/main");
    }
  };

  const leaveChannel = async () => {
    if (channel === null) return;
    try {
      changeLoading(true);
      if (params.type == "user") {
        throw new Error("invalid operation");
      } else {
        await axios.put(`/api/GroupChannel/leave/${params.id}`);
        dispatch({
          type: ACTION.LEAVE_CHANNELS,
          payload: {
            channels: [channel],
          },
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      changeLoading(false);
      navigate("/main");
    }
  };

  return (
    <>
      {channel !== null ? (
        <div className="messages-top-bar">
          <h2>{channel.name}</h2>
          {channel.isOwner || params.type == "user" ? (
            <button
              className="message-header-btn delete modal-button"
              onClick={deleteChannel}
            >
              Delete
            </button>
          ) : (
            <button
              className="message-header-btn leave modal-button"
              onClick={leaveChannel}
            >
              Leave
            </button>
          )}
        </div>
      ) : undefined}
    </>
  );
}
