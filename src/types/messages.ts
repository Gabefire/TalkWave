export interface messageType {
  author: string;
  content: string;
  createdAt: string;
  isOwner: boolean;
}

export interface messageWSDto {
  author: string;
  content: string;
  createdAt: string;
}


export interface messageQueryType {
  name: string;
  type: "user" | "group" | null;
}

export interface channelType {
  name: string;
  type: "user" | "group";
  channelId: number;
  isOwner: boolean;
  channelPicLink?: string 
}

export interface userSearchDto   {
  userId: string,
  userName: string,
  profilePicLink: string
}

export interface groupChannelDto {
  channelId: number,
  channelPicLink: string,
  createdAt: string,
  lastUpdated: string,
  name: string,
  type: "group",
  userId: number
}