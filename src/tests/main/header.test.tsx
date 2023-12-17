import { RenderOptions, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { MessageQueryContext } from "../../components/main/main_root";
import { ReactElement } from "react";
import Header from "../../components/main/header/header";
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

describe("header component", () => {
  it("Drop down menu profile controls disappear when clicking somewhere else in doc", async () => {
    const user = userEvent.setup();
    customRender(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
      {
        type: "group",
        name: "gabe",
      }
    );

    // test will need to be changed when log in logic added
    const dropDownBtn = screen.getByText("Gabe Underwood");

    await user.click(dropDownBtn);

    const join_button = screen.getByText(/Edit Profile/);

    expect(join_button).toBeInTheDocument();

    const randomLocation = screen.getByRole("heading", { name: "TalkWave" });

    await user.click(randomLocation);

    expect(join_button).not.toBeInTheDocument();
  });
  it("Drop down menu button will close profile controls when pressed again", async () => {
    const user = userEvent.setup();
    customRender(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
      {
        type: "group",
        name: "gabe",
      }
    );
    // test will need to be changed when log in logic added
    const dropDownBtn = screen.getByText("Gabe Underwood");

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
  it("Search bar drops menu when clicked", async () => {
    const user = userEvent.setup();
    customRender(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
      {
        type: "group",
        name: "gabe",
      }
    );

    const searchBar = screen.getByRole("searchbox");
    console.log(global.window.location.pathname);
    await user.type(searchBar, "test");

    expect(
      await screen.findByRole("heading", { name: /Groups/ })
    ).toBeInTheDocument();
  });
  it("Clicking search link switches page", async () => {
    const user = userEvent.setup();
    const currentPage = location.href;
    customRender(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
      {
        type: "group",
        name: "gabe",
      }
    );

    const searchBar = screen.getByRole("searchbox");

    await user.type(searchBar, "test");

    const testLink = screen.getAllByRole("link")[0];

    await user.click(testLink);

    expect(location.href).not.toBe(currentPage);
  });
});
