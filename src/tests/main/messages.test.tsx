import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { authContextType } from "../../types/auth";
import { vi } from "vitest";
import { act } from "react-dom/test-utils";
import MessageHeader from "../../components/main/message/message_header";
import MessageBody from "../../components/main/message/message_body";
import MessageSend from "../../components/main/message/message_send";
import { customRender } from "../customRender";
import { channelListContextType } from "../../contexts/channelListContext";

const userContext: authContextType = {
  userName: "test",
  setUserName: (userName: string | null) => {
    userName;
  },
  token: "123",
  setToken: (token: string | null) => {
    token;
  },
};

const channelListContext: channelListContextType = {
  channelDispatch: [
    {
      type: "group",
      name: "group1",
      channelId: 1,
      isOwner: true,
    },
    {
      type: "group",
      name: "group2",
      channelId: 1235,
      isOwner: true,
    },
    {
      type: "user",
      name: "user1",
      channelId: 1236,
      isOwner: true,
    },
    {
      type: "user",
      name: "user2",
      channelId: 1237,
      isOwner: true,
    },
  ],
  dispatch: vi.fn(),
  changeLoading: vi.fn(),
  loading: false,
};

vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useNavigate: () => vi.fn(),
  useParams: vi.fn().mockReturnValue({
    id: "1",
    type: "group",
  }),
}));

window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe("Message Header", () => {
  test("Switches url when delete button is hit", async () => {
    await act(async () =>
      customRender(<MessageHeader />, userContext, channelListContext)
    );

    const user = userEvent.setup();
    const button = screen.getByRole("button", { name: "Delete" });

    await user.click(button);

    expect(global.window.location.pathname).not.toContain("/group/1234");
  });

  test("Header is shown", async () => {
    await act(async () =>
      customRender(<MessageHeader />, userContext, channelListContext)
    );

    expect(screen.getByRole("heading", { name: "test" })).toBeInTheDocument();
  });
});

describe("Message Body", () => {
  test("Message is shown", async () => {
    await act(async () => {
      const message = null;
      customRender(
        <MessageBody message={message} />,
        userContext,
        channelListContext
      );
    });

    const message = screen.getByText(/Hi this is Gabe/);

    expect(message).toBeInTheDocument;
  });
  test("Message that was added is shown", async () => {
    await act(async () => {
      const message = {
        Author: "leah",
        Content: "Hi this is Leah",
        CreatedAt: new Date().toString(),
        IsOwner: false,
      };
      customRender(
        <MessageBody message={message} />,
        userContext,
        channelListContext
      );
    });
  });
});

describe("Message Send", () => {
  test("Message is posted when click button is hit with text included", async () => {
    const post = vi.fn();
    customRender(<MessageSend post={post} />, userContext, channelListContext);

    const user = userEvent.setup();
    const message = screen.getByRole("textbox", { name: "message" });
    const button = screen.getByRole("button", { name: "Send" });

    await user.type(message, "Hi how are you");
    await user.click(button);

    expect(post).toHaveBeenCalled();
  });

  test("Message is not posted when click button is hit with text not included", async () => {
    const post = vi.fn();
    customRender(<MessageSend post={post} />, userContext, channelListContext);

    const user = userEvent.setup();
    const button = screen.getByRole("button", { name: "Send" });

    await user.click(button);

    expect(post).not.toHaveBeenCalled();
  });
});
