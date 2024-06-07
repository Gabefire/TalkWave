import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import Header from "../../components/main/header/header";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import { channelListContextType } from "../../contexts/channelListContext";
import { customRender } from "../customRender";
import { userContext } from "../testUtil";

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

vi.mock("react-router-dom", async () => {
  const actual: [] = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => vi.fn().mockReturnValue({ id: "1", type: "group" }),
  };
});

describe("header component", () => {
  test("Drop down menu profile controls disappear when clicking somewhere else in doc", async () => {
    const user = userEvent.setup();
    customRender(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
      userContext,
      channelListContext
    );

    // test will need to be changed when log in logic added
    const dropDownBtn = screen.getByText("test");

    await user.click(dropDownBtn);

    const join_button = screen.getByText(/Edit Profile/);

    expect(join_button).toBeInTheDocument();

    const randomLocation = screen.getByRole("heading", { name: "TalkWave" });

    await user.click(randomLocation);

    expect(join_button).not.toBeInTheDocument();
  });
  test("Drop down menu button will close profile controls when pressed again", async () => {
    const user = userEvent.setup();
    customRender(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
      userContext,
      channelListContext
    );
    // test will need to be changed when log in logic added
    const dropDownBtn = screen.getByText("test");

    await user.click(dropDownBtn);

    const join_button = screen.getByText(/Edit Profile/);

    expect(join_button).toBeInTheDocument();
    await user.click(dropDownBtn);
    expect(
      await screen
        .findByText(/Edit Profile/, undefined, { timeout: 100 })
        .catch(() => {
          return false;
        })
    ).toBeFalsy();
  });
  test("Search bar drops menu when clicked", async () => {
    const user = userEvent.setup();
    customRender(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
      userContext,
      channelListContext
    );

    const searchBar = screen.getByRole("searchbox");
    await user.type(searchBar, "test");

    expect(
      await screen.findByRole("heading", { name: /Groups/ })
    ).toBeInTheDocument();
  });
});
