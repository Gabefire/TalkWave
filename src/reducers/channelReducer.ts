import { channelType } from "../types/messages";

export const ACTION = {
    SET_CHANNEL: "set_channel",
    ADD_CHANNEL: "add-channel",
    DELETE_CHANNEL: "delete-post",
    LEAVE_CHANNEL: "leave_channel",
    };
  
export type ACTION_TYPE = {
    type: string;
    payload: channelType;
    };

export function channelListReducer(
channels: channelType[],
action: ACTION_TYPE
): channelType[] {
    switch (action.type) {
        case ACTION.SET_CHANNEL:
            return channels
        case ACTION.ADD_CHANNEL:
            return channels.concat(action.payload);
        case ACTION.DELETE_CHANNEL:
            return channels.filter(
                (channel) => channel.channelId != action.payload.channelId
            );
        case ACTION.LEAVE_CHANNEL:
            return channels.filter(
                (channel) => channel.channelId != action.payload.channelId
            );
        default:
            return channels
    }
    }
