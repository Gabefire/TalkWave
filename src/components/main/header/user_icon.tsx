import axios from "axios";
import { channelType, userSearchDto } from "../../../types/messages";
import { useNavigate } from "react-router-dom";
import ProfilePic from "../profile_pic";
import { ACTION } from "../../../reducers/channelReducer";
import { useContext } from "react";
import ChannelListContext from "../../../contexts/channelListContext";

interface userIconType {
  user: userSearchDto;
}
function UserIcon({ user }: userIconType) {
  const navigator = useNavigate();

  const { dispatch, changeLoading } = useContext(ChannelListContext);

  const checkUserChannel = async (requestedUserId: string) => {
    try {
      changeLoading(true);
      const response = await axios.post<channelType>(
        `/api/UserChannel/${requestedUserId}`
      );
      dispatch({
        type: ACTION.ADD_CHANNELS,
        payload: {
          channels: [
            {
              ...response.data,
              name: user.userName,
            },
          ],
        },
      });
      navigator(`/main/user/${response?.data.channelId}`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 409) {
          navigator(`/main/user/${err.response?.data.channelId}`);
        } else {
          console.log(err);
        }
      } else {
        console.log(err);
      }
    } finally {
      changeLoading(false);
    }
  };

  return (
    <>
      <button
        className="user-icon"
        key={user.userId}
        onClick={async () => {
          await checkUserChannel(user.userId.toString());
        }}
      >
        <ProfilePic size="15" url="" userName={user.userName} />
      </button>
    </>
  );
}

export default UserIcon;
