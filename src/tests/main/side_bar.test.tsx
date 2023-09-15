import { RenderOptions, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { MessageQueryContext } from "../../components/main/App";
import { ReactElement } from "react";
import SideBar from "../../components/main/side_bar";
import { vi } from "vitest";
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
    const updateMessageQuery = vi.fn();
    customRender(<SideBar updateMessageQuery={updateMessageQuery} />, {
      type: "group",
      name: "gabe",
    });

    expect(
      screen.getByRole("heading", { name: "Messaging" })
    ).toBeInTheDocument();
  });
  it("changes message query upon click", async () => {
    const updateMessageQuery = vi.fn();
    const user = userEvent.setup();
    customRender(<SideBar updateMessageQuery={updateMessageQuery} />, {
      type: "group",
      name: "gabe",
    });
    const userButton = screen.getByRole("button", { name: "gabe" });

    await user.click(userButton);

    expect(updateMessageQuery).toBeCalled();
  });
});
