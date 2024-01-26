import { RenderOptions, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { MessageQueryContext } from "../../components/main/main_root";
import { ReactElement } from "react";
import SideBar from "../../components/main/side_bar/side_bar";
import { BrowserRouter } from "react-router-dom";
import { messageQueryType, messageType } from "../../types/messages";
import { setupServer } from "msw/node";
import { HttpResponse, http } from "msw";
import { channelType } from "../../types/messages";
import { act } from "react-dom/test-utils";

const messageList: messageType[] = [
  {
    from: "gabe",
    content: "Hi this is Gabe",
    date: new Date(),
    owner: true,
  },
  {
    from: "ben",
    content: "Hi this is ben",
    date: new Date(),
    owner: false,
  },
  {
    from: "leah",
    content: "Hi this is Leah",
    date: new Date(),
    owner: false,
  },
];

const channelList: channelType[] = [
  {
    type: "group",
    name: "group1",
    channelId: "1234",
    isOwner: true,
  },
  {
    type: "group",
    name: "group2",
    channelId: "1235",
    isOwner: true,
  },
  {
    type: "user",
    name: "user1",
    channelId: "1236",
    isOwner: true,
  },
  {
    type: "user",
    name: "user2",
    channelId: "1237",
    isOwner: true,
  },
];
export const restHandler = [
  http.get(`/api/Channel`, () => {
    return HttpResponse.json(channelList);
  }),
];

const server = setupServer(...restHandler);

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

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

afterAll(() => server.close());

afterEach(() => server.resetHandlers());

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
    await act(async () => {
      customRender(
        <BrowserRouter>
          <SideBar />
        </BrowserRouter>,
        {
          type: "group",
          name: "gabe",
        }
      );
    });
    const userButton = screen.getByText(/user1/);

    await user.click(userButton);

    expect(global.window.location.pathname).toBe("/user/1236");
  });
  it("Drop down menu to create groups shows upon click", async () => {
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
    const dropDownBtn = screen.getByRole("button", { name: "+" });

    await user.click(dropDownBtn);

    expect(screen.getByText(/Create Group/)).toBeVisible();
  });
  it("Drop down menu to create groups disappears when clicking somewhere else in doc", async () => {
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
    const dropDownBtn = screen.getByRole("button", { name: "+" });

    await user.click(dropDownBtn);

    const join_button = screen.getByText(/Create Group/);

    expect(join_button).toBeInTheDocument();

    const randomLocation = screen.getByRole("button", { name: "All" });

    await user.click(randomLocation);

    expect(join_button).not.toBeInTheDocument();
  });
  it("Drop down menu button will close create group menu when pressed again", async () => {
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
