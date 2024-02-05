import { RenderOptions, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { ReactElement } from "react";
import Header from "../../components/main/header/header";
import { BrowserRouter } from "react-router-dom";
import { AuthContext } from "../../contexts/authProvider";
import { authContextType } from "../../types/auth";
import { vi } from "vitest";

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
      userContext
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
      userContext
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
      userContext
    );

    const searchBar = screen.getByRole("searchbox");
    console.log(global.window.location.pathname);
    await user.type(searchBar, "test");

    expect(
      await screen.findByRole("heading", { name: /Groups/ })
    ).toBeInTheDocument();
  });
  test("Clicking search link switches page", async () => {
    const user = userEvent.setup();
    const currentPage = location.href;
    customRender(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
      userContext
    );

    const searchBar = screen.getByRole("searchbox");

    await user.type(searchBar, "gabe");

    const testLink = await screen.findAllByRole("link");

    await user.click(testLink[0]);

    expect(location.href).not.toBe(currentPage);
  });
});
