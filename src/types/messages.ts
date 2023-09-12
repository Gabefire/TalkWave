export interface messageType {
  from: string;
  content: string;
  date: Date;
  owner: boolean;
}

export interface messageQueryType {
  name: string;
  type: "user" | "group" | null;
}

export interface messageResultType {
  title: string;
  type: "user" | "group" | null;
  owner: boolean;
  messages: messageType[];
}
