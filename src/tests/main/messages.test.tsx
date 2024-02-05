import { RenderOptions, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { ReactElement } from "react";
import { authContextType } from "../../types/auth";
import { AuthContext } from "../../contexts/authProvider";
import { vi } from "vitest";
import { act } from "react-dom/test-utils";
import MessageHeader from "../../components/main/message/message_header";
import MessageBody from "../../components/main/message/message_body";
import MessageSend from "../../components/main/message/message_send";

const customRender = (
  ui: ReactElement,
  providerProps: authContextType,
  renderOptions?: Omit<RenderOptions, "wrapper">
) => {
  return render(
    <AuthContext.Provider value={{ ...providerProps }}>
      {ui}
    </AuthContext.Provider>,
    renderOptions
  );
};

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
    await act(async () => customRender(<MessageHeader />, userContext));

    const user = userEvent.setup();
    const button = screen.getByRole("button", { name: "Delete" });

    await user.click(button);

    expect(global.window.location.pathname).not.toContain("/group/1234");
  });

  test("Header is shown", async () => {
    await act(async () => customRender(<MessageHeader />, userContext));

    expect(screen.getByRole("heading", { name: "test" })).toBeInTheDocument();
  });
});

describe("Message Body", () => {
  test("Message is shown", async () => {
    await act(async () => {
      const message = null;
      customRender(<MessageBody message={message} />, userContext);
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
      customRender(<MessageBody message={message} />, userContext);
    });
  });
});

describe("Message Send", () => {
  test("Message is posted when click button is hit with text included", async () => {
    const post = vi.fn();
    customRender(<MessageSend post={post} />, userContext);

    const user = userEvent.setup();
    const message = screen.getByRole("textbox", { name: "message" });
    const button = screen.getByRole("button", { name: "Send" });

    await user.type(message, "Hi how are you");
    await user.click(button);

    expect(post).toHaveBeenCalled();
  });

  test("Message is not posted when click button is hit with text not included", async () => {
    const post = vi.fn();
    customRender(<MessageSend post={post} />, userContext);

    const user = userEvent.setup();
    const button = screen.getByRole("button", { name: "Send" });

    await user.click(button);

    expect(post).not.toHaveBeenCalled();
  });
});
