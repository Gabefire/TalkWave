import { channelType, messageType } from "../types/messages";
import { HttpResponse, http } from "msw";

const messageList: messageType[] = [
    {
      author: "gabe",
      content: "Hi this is Gabe",
      createdAt: new Date().toString(),
      isOwner: true,
    },
    {
      author: "ben",
      content: "Hi this is ben",
      createdAt: new Date().toString(),
      isOwner: false,
    },
    {
      author: "leah",
      content: "Hi this is Leah",
      createdAt: new Date().toString(),
      isOwner: false,
    },
  ];
  
  const channelList: channelType[] = [
    {
      type: "group",
      name: "group1",
      channelId: "1",
      isOwner: true,
    },
    {
      type: "group",
      name: "group2",
      channelId: "1235",
      isOwner: true,
    },
    {
      type: "user",
      name: "user1",
      channelId: "1236",
      isOwner: true,
    },
    {
      type: "user",
      name: "user2",
      channelId: "1237",
      isOwner: true,
    },
  ];

const channel: channelType = {
    name: "test",
    type: "user",
    channelId: "1",
    isOwner: true,
  }
  

const restHandler = [
    http.get(`/api/Channel`, () => {
      return HttpResponse.json(channelList);
    }),

    http.get(`/api/Message/*`, () => {
        return HttpResponse.json(messageList)
    }),
    http.get("http://localhost:5200/api/Message/*/*", () => {
        return new Response("test")
    }),
    http.get("/api/Channel/*", () => {
        return HttpResponse.json(channel)
    }),
    http.delete("/api/Channel/*", () => {
        return HttpResponse.text()
    })
  ];

export default restHandler