import { RenderOptions, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { MessageQueryContext } from "../../components/main/App";
import { ReactElement } from "react";
import { messageQueryType } from "../../types/messages";
import Messages from "../../components/main/messages";

const customRender = (
  ui: ReactElement,
  providerProps: messageQueryType,
  renderOptions?: Omit<RenderOptions, "wrapper">
) => {
  return render(
    <MessageQueryContext.Provider value={{ ...providerProps }}>
      {ui}
    </MessageQueryContext.Provider>,
    renderOptions
  );
};

describe("message component", () => {
  test("Messages show default text", () => {
    render(<Messages />);
    expect(screen.getByText(/^No Messages Found/)).toBeInTheDocument();
  });

  test("displays messages and title", () => {
    customRender(<Messages />, { type: "group", name: "gabe" });

    expect(screen.getByRole("heading", { name: "gabe" })).toBeInTheDocument();
    expect(screen.getByText(/^Hi this is Leah/)).toBeInTheDocument();
  });

  test("adding message includes div in documents", async () => {
    const user = userEvent.setup();
    customRender(<Messages />, { type: "group", name: "gabe" }).debug();

    const message = screen.getByRole("textbox", { name: "message" });
    const button = screen.getByRole("button", { name: "Send" });

    await user.type(message, "Hi how are you");
    await user.click(button);

    expect(screen.getByText(/^His how are you/)).toBeInTheDocument();
  });

  test("deletes group when delete button is hit", async () => {
    const user = userEvent.setup();
    customRender(<Messages />, { type: "group", name: "gabe" });
    const button = screen.getByRole("button", { name: "Delete" });

    await user.click(button);

    expect(screen.getByText(/^No Messages Found/)).toBeInTheDocument();
  });
});
