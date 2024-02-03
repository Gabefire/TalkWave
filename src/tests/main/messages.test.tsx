import { RenderOptions, cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { ReactElement } from "react";
import Messages from "../../components/main/message/messages";
import { authContextType } from "../../types/auth";
import { AuthContext } from "../../contexts/authProvider";
import { vi } from "vitest";
import { act } from "react-dom/test-utils";
import createWebsocket from "../../components/main/message/createWebsocket";

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

describe("Message Component", () => {
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

  const mockWebsocket = vi.hoisted(() => {
    return {
      addEventListener: () => vi.fn(),
      removeEventListener: () => vi.fn(),
      close: () => vi.fn(),
      send: () => vi.fn(),
      onopen: () => vi.fn(),
      onmessage: () => vi.fn(),
      onerror: () => vi.fn(),
      onclose: () => vi.fn(),
    };
  });

  const createWebsocketMock = vi.hoisted(() => {
    return () => vi.fn().mockReturnValue(mockWebsocket);
  });

  vi.mock("../../components/main/message/createWebsocket.ts", () => {
    return {
      default: createWebsocketMock,
    };
  });

  vi.mock("react-router-dom", () => ({
    ...vi.importActual("react-router-dom"),
    useNavigate: () => vi.fn(),
    useParams: () =>
      vi.fn().mockReturnValue({
        id: "1",
        type: "group",
      }),
  }));

  vi.mock("react", async () => {
    const actual = (await vi.importActual("react")) as [];
    return {
      ...actual,
      useRef: vi.fn().mockReturnValue({ current: mockWebsocket }),
    };
  });

  window.HTMLElement.prototype.scrollIntoView = vi.fn();

  test("Messages show loading", async () => {
    customRender(<Messages />, userContext);

    expect(screen.getByText(/Loading.../)).toBeInTheDocument();
  });

  test("Displays messages and title", async () => {
    customRender(<Messages />, userContext);

    expect(
      await screen.findByRole("heading", { name: "test" })
    ).toBeInTheDocument();
    expect(await screen.findByText(/^Hi this is Leah/)).toBeInTheDocument();
  });

  test("Websocket events are added once created", async () => {
    act(() => {
      customRender(<Messages />, userContext);
    });

    expect(createWebsocket).toHaveBeenCalled();
  });

  test("Websocket closes on unmount", async () => {
    const spy = vi.spyOn(mockWebsocket, "close");
    act(() => customRender(<Messages />, userContext));
    cleanup();

    expect(spy).toHaveBeenCalled();
  });

  test("Pushing send sends message to websocket", async () => {
    const spy = vi.spyOn(mockWebsocket, "send");
    customRender(<Messages />, userContext);

    const user = userEvent.setup();
    const message = screen.getByRole("textbox", { name: "message" });
    const button = screen.getByRole("button", { name: "Send" });

    await user.type(message, "Hi how are you");
    await user.click(button);

    expect(spy).toHaveBeenCalled();
  });

  test("Switches url when delete button is hit", async () => {
    customRender(<Messages />, userContext);

    const user = userEvent.setup();
    const button = screen.getByRole("button", { name: "Delete" });

    await user.click(button);

    expect(global.window.location.pathname).not.toContain("/group/1234");
  });
});
