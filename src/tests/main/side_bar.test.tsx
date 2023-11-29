import { RenderOptions, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { MessageQueryContext } from "../../components/main/main_root";
import { ReactElement } from "react";
import SideBar from "../../components/main/side_bar/side_bar";
import { BrowserRouter } from "react-router-dom";
import { messageQueryType } from "../../types/messages";

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

describe("side bar component", () => {
  it("shows header", () => {
    customRender(
      <BrowserRouter>
        <SideBar />
      </BrowserRouter>,
      {
        type: "group",
        name: "gabe",
      }
    );

    expect(
      screen.getByRole("heading", { name: "Messaging" })
    ).toBeInTheDocument();
  });
  it("changes message query upon click", async () => {
    const user = userEvent.setup();
    customRender(
      <BrowserRouter>
        <SideBar />
      </BrowserRouter>,
      {
        type: "group",
        name: "gabe",
      }
    );
    const userButton = screen.getByText(/user1/);

    await user.click(userButton);
    console.log(global.window.location.pathname);
    expect(global.window.location.pathname).toBe("/user/1236");
  });
});
