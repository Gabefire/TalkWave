import { createContext } from "react";
import { ACTION_TYPE } from "../reducers/channelReducer";
import { channelType } from "../types/messages";

export type channelListContextType = {
    channelDispatch: channelType[];
    dispatch: React.Dispatch<ACTION_TYPE>;
    changeLoading: (loading: boolean) => void;
    loading: boolean;
  };
  
const ChannelListContext = createContext<channelListContextType>({} as channelListContextType);

export default ChannelListContext