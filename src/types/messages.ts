export interface messageType {
  from: string;
  content: string;
  date: Date;
}

export interface messageQueryType {
  name: string;
  type: "user" | "group" | null;
}
