import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { loginErrorType } from "../../types/sign_up.js";

import Login from "../../components/auth/login.js";
const mockUsedNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useNavigate: () => mockUsedNavigate,
}));

describe("login component", () => {
  it("renders correct heading", () => {
    const login = vi.fn();
    render(<Login login={login} />);

    const header = screen.getByRole("heading", { name: "Login" });

    expect(header).toBeInTheDocument();
  });

  it("should call click function on login with fields filled out", async () => {
    const login = vi.fn();
    const user = userEvent.setup();

    render(<Login login={login} />).debug();

    const username = screen.getByRole("textbox", {
      name: "username",
    });

    const password = screen.getByLabelText(/Password:/i);

    const button = screen.getByRole("button", { name: "Login" });
    await user.type(username, "test");
    await user.type(password, "test");
    await user.click(button);

    expect(login).toBeCalled();
  });
  it("when fields are empty login should not run and required fileds should be in", async () => {
    const login = vi.fn();
    const user = userEvent.setup();

    render(<Login login={login} />);

    const button = screen.getByRole("button", { name: "Login" });

    await user.click(button);

    expect(login).not.toHaveBeenCalled();
    expect(await screen.findByText(/Username is Required/i)).toBeVisible();
    expect(await screen.findByText(/Password is Required/i)).toBeVisible();
  });
  it("error should show if login api fails", async () => {
    const login = vi
      .fn()
      .mockImplementation(() =>
        Promise.resolve([{ connection: "test" }] as loginErrorType)
      );
    const user = userEvent.setup();
    render(<Login login={login} />);

    const username = screen.getByRole("textbox", {
      name: "username",
    });

    const password = screen.getByLabelText(/Password:/i);

    const button = screen.getByRole("button", { name: "Login" });
    await user.type(username, "test");
    await user.type(password, "test");
    await user.click(button);

    expect(login).toBeCalled();
    expect(await screen.findByText("test")).toBeVisible();
  });
});
