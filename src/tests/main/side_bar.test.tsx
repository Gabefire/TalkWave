import { RenderOptions, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { ReactElement } from "react";
import SideBar from "../../components/main/side_bar/side_bar";
import { BrowserRouter, MemoryRouter as Router } from "react-router-dom";
import { AuthContext } from "../../contexts/authProvider";
import { authContextType } from "../../types/auth";
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

vi.mock("react-router-dom", async () => {
  const actual: [] = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => vi.fn().mockReturnValue({ id: "1", type: "group" }),
  };
});

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

describe("side bar component", () => {
  it("shows header", () => {
    customRender(
      <Router>
        <SideBar />
      </Router>,
      userContext
    );

    expect(
      screen.getByRole("heading", { name: "Messaging" })
    ).toBeInTheDocument();
  });

  it("changes message query upon click", async () => {
    const user = userEvent.setup();

    await act(() =>
      render(
        <BrowserRouter>
          <SideBar />
        </BrowserRouter>
      )
    );

    const userButton = await screen.findByText(/user1/);

    await user.click(userButton);

    expect(global.window.location.pathname).toBe("/user/1236");
  });

  it("Drop down menu to create groups shows upon click", async () => {
    await act(() =>
      render(
        <Router initialEntries={["/main"]}>
          <SideBar />
        </Router>
      )
    );
    const user = userEvent.setup();
    const dropDownBtn = screen.getByRole("button", { name: "+" });

    await user.click(dropDownBtn);

    expect(screen.getByText(/Create Group/)).toBeVisible();
  });
  it("Drop down menu to create groups disappears when clicking somewhere else in doc", async () => {
    const user = userEvent.setup();
    await act(() =>
      render(
        <Router initialEntries={["/main"]}>
          <SideBar />
        </Router>
      )
    );

    const dropDownBtn = screen.getByRole("button", { name: "+" });

    await user.click(dropDownBtn);

    const joinButton = screen.getByText(/Create Group/);

    expect(joinButton).toBeInTheDocument();

    const randomLocation = screen.getByRole("button", { name: "All" });

    await user.click(randomLocation);

    expect(joinButton).not.toBeInTheDocument();
  });
  it("Drop down menu button will close create group menu when pressed again", async () => {
    const user = userEvent.setup();

    await act(() =>
      render(
        <Router initialEntries={["/main"]}>
          <SideBar />
        </Router>
      )
    );

    const dropDownBtn = screen.getByRole("button", { name: "+" });

    await user.click(dropDownBtn);

    const join_button = screen.getByText(/Create Group/);

    expect(join_button).toBeInTheDocument();
    await user.click(dropDownBtn);
    expect(
      await screen
        .findByText(/Create Group/, undefined, { timeout: 100 })
        .catch(() => {
          return false;
        })
    ).toBeFalsy();
  });
});
