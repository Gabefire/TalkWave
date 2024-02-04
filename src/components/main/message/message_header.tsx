import { useEffect, useState } from "react";
import { channelType } from "../../../types/messages";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function MessageHeader() {
  const [channel, setChannel] = useState({} as channelType);

  const params = useParams();
  const navigate = useNavigate();

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
    try {
      await axios.delete(`/api/Channel/${params.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      navigate("/main");
    }
  };

  const leaveChannel = async () => {
    try {
      if (params.type == "user") {
        throw new Error("invalid operation");
      } else {
        await axios.put(`/api/GroupChannel/leave/${params.id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      navigate("/main");
    }
  };

  return (
    <>
      <div className="messages-top-bar">
        <h2>{channel.name}</h2>
        {channel.isOwner || params.type == "user" ? (
          <button className="message-header-btn delete" onClick={deleteChannel}>
            Delete
          </button>
        ) : (
          <button className="message-header-btn leave" onClick={leaveChannel}>
            Leave
          </button>
        )}
      </div>
    </>
  );
}
