import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import SideBar from "../../components/main/side_bar/side_bar.tsx";
import { MemoryRouter as Router } from "react-router-dom";
import { authContextType } from "../../types/auth";
import { vi } from "vitest";
import { act } from "react-dom/test-utils";
import { channelListContextType } from "../../contexts/channelListContext";
import { customRender } from "../customRender";

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

describe("side bar component", () => {
  it("shows header", () => {
    customRender(
      <Router>
        <SideBar />
      </Router>,
      userContext,
      channelListContext
    );

    expect(
      screen.getByRole("heading", { name: "Messaging" })
    ).toBeInTheDocument();
  });

  it("Expect user navlink to be in document", async () => {
    await act(() =>
      customRender(
        <Router>
          <SideBar />
        </Router>,
        userContext,
        channelListContext
      )
    );

    const userButton = screen.getByRole("link", { name: /U user1/ });

    expect(userButton).toBeInTheDocument();
  });

  it("Drop down menu to create groups shows upon click", async () => {
    await act(() =>
      customRender(
        <Router>
          <SideBar />
        </Router>,
        userContext,
        channelListContext
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
      customRender(
        <Router>
          <SideBar />
        </Router>,
        userContext,
        channelListContext
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
      customRender(
        <Router>
          <SideBar />
        </Router>,
        userContext,
        channelListContext
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
