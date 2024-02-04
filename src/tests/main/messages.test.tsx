import { RenderOptions, cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { ReactElement } from "react";
import Messages from "../../components/main/message/messages";
import { authContextType } from "../../types/auth";
import { AuthContext } from "../../contexts/authProvider";
import { vi } from "vitest";
import { act } from "react-dom/test-utils";

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

  const mock = vi.hoisted(() => {
    return {
      addEventListener: () => vi.fn(),
      removeEventListener: () => vi.fn(),
      close: () => vi.fn(),
      send: () => vi.fn(),
    };
  });

  vi.mock("../../components/main/message/createWebsocket.ts", () => {
    return {
      default: vi.fn().mockResolvedValue(mock),
    };
  });

  vi.mock("react-router-dom", () => ({
    ...vi.importActual("react-router-dom"),
    useNavigate: () => vi.fn(),
    useParams: vi.fn().mockReturnValue({
      id: "1",
      type: "group",
    }),
  }));

  window.HTMLElement.prototype.scrollIntoView = vi.fn();

  test("Messages show default text when not connected yet", async () => {
    customRender(<Messages />, userContext);

    expect(screen.getByText(/No information/)).toBeInTheDocument();
  });

  test("Displays messages and title", async () => {
    await act(async () => customRender(<Messages />, userContext));

    expect(screen.getByRole("heading", { name: "test" })).toBeInTheDocument();
    expect(screen.getByText(/^Hi this is Leah/)).toBeInTheDocument();
  });

  test("Websocket events are added once created", async () => {
    const spy = vi.spyOn(mock, "addEventListener");
    await act(async () => customRender(<Messages />, userContext));

    expect(spy).toHaveBeenCalled();
  });

  test("Websocket closes on unmount", async () => {
    const spy = vi.spyOn(mock, "close");
    await act(async () => customRender(<Messages />, userContext));
    cleanup();

    expect(spy).toHaveBeenCalled();
  });

  test("Pushing send sends message to websocket", async () => {
    const spy = vi.spyOn(mock, "send");
    await act(async () => customRender(<Messages />, userContext));

    const user = userEvent.setup();
    const message = screen.getByRole("textbox", { name: "message" });
    const button = screen.getByRole("button", { name: "Send" });

    await user.type(message, "Hi how are you");
    await user.click(button);

    expect(spy).toHaveBeenCalled();
  });

  test("Switches url when delete button is hit", async () => {
    await act(async () => customRender(<Messages />, userContext));

    const user = userEvent.setup();
    const button = screen.getByRole("button", { name: "Delete" });

    await user.click(button);

    expect(global.window.location.pathname).not.toContain("/group/1234");
  });
});
