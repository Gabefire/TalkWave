import axios from "axios";
import { userSearchDto } from "../../../types/messages";
import { useNavigate } from "react-router-dom";

interface userIconType {
  user: userSearchDto;
}
function UserIcon({ user }: userIconType) {
  const navigator = useNavigate();

  const checkUserChannel = async (requestedUserId: string) => {
    try {
      const response = await axios.post(`/api/UserChannel/${requestedUserId}`);
      navigator(`/main/user/${response?.data.channelId}`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status == 409) {
          navigator(`/main/user/${err.response?.data.channelId}`);
        } else {
          console.log(err);
        }
      }
    }
  };
  return (
    <>
      <button
        key={user.userId}
        onClick={async () => {
          await checkUserChannel(user.userId.toString());
        }}
      >
        {user.userName}
      </button>
    </>
  );
}

export default UserIcon;
