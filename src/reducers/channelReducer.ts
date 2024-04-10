import { channelType } from "../types/messages";

export const ACTION = {
    SET_CHANNELS: "set_channel",
    ADD_CHANNELS: "add-channel",
    DELETE_CHANNELS: "delete-post",
    LEAVE_CHANNELS: "leave_channel",
    };
  
export type ACTION_TYPE = {
    type: string;
    payload: {
        channels: channelType[],
    };
    };

export function channelListReducer(
channels: channelType[],
action: ACTION_TYPE
): channelType[] {
    switch (action.type) {
        case ACTION.SET_CHANNELS:
            channels = action.payload.channels
            return channels
        case ACTION.ADD_CHANNELS:
            return channels.concat(action.payload.channels)
        case ACTION.DELETE_CHANNELS:
            return channels.filter(
                (channel) => {
                    action.payload.channels.forEach(
                        (action_channel) => channel.channelId == action_channel.channelId
                    )
                }
            );
        case ACTION.LEAVE_CHANNELS:
            return channels.filter(
                (channel) => {
                    action.payload.channels.forEach(
                        (action_channel) => channel.channelId == action_channel.channelId
                    )
                }
            );
        default:
            return channels
    }
    }
