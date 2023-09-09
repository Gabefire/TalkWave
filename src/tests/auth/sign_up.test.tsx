import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import SignUp from "../../components/auth/sign_up";

const mockUsedNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useNavigate: () => mockUsedNavigate,
}));

describe("sign up component", () => {
  it("renders correct heading", () => {
    const login = vi.fn();
    const signUp = vi.fn();
    render(<SignUp login={login} signUp={signUp} />);

    const header = screen.getByRole("heading", { name: "Sign Up" });

    expect(header).toBeInTheDocument();
  });

  it("when fields are empty sign up should not run and errors should display", async () => {
    const signUp = vi.fn();
    const login = vi.fn();
    const user = userEvent.setup();

    render(<SignUp login={login} signUp={signUp} />);

    const button = screen.getByRole("button", { name: "Sign Up" });

    await user.click(button);

    expect(signUp).not.toBeCalled();
    expect(login).not.toBeCalled();
    expect(await screen.findByText(/Username is Required/i)).toBeVisible();
    expect(await screen.findByText(/Password is Required/i)).toBeVisible();
    expect(
      await screen.findByText(/Password Confirmation is Required/i)
    ).toBeVisible();
  });

  it("should call sign up function and login with fields filled out", async () => {
    const login = vi.fn();
    const signUp = vi.fn();
    const user = userEvent.setup();

    render(<SignUp login={login} signUp={signUp} />);

    const username = screen.getByRole("textbox", {
      name: "username",
    });
    const password = screen.getByLabelText(/^Password:/i);
    const passwordConfirmation = screen.getByLabelText(/Confirm Password:/i);

    const button = screen.getByRole("button", { name: "Sign Up" });

    await user.type(username, "test");
    await user.type(password, "test");
    await user.type(passwordConfirmation, "test");
    await user.click(button);

    expect(signUp).toBeCalled();
    expect(login).toBeCalled();
  });

  it("error should show if login api fails", async () => {
    const signUp = vi.fn();
    const login = vi.fn().mockImplementation(() => {
      return [{ serverError: "test error" }];
    });

    const user = userEvent.setup();
    render(<SignUp signUp={signUp} login={login} />);

    const username = screen.getByRole("textbox", {
      name: "username",
    });
    const password = screen.getByLabelText(/^Password:/i);
    const passwordConfirmation = screen.getByLabelText(/Confirm Password:/i);

    const button = screen.getByRole("button", { name: "Sign Up" });

    await user.type(username, "test");
    await user.type(password, "test");
    await user.type(passwordConfirmation, "test");
    await user.click(button);

    expect(login).toBeCalled();
    expect(await screen.findByText(/test error/i)).toBeVisible();
  });

  it("error should show if sign up api fails", async () => {
    const login = vi.fn();
    const signUp = vi.fn().mockImplementation(() => {
      return [{ serverError: "test error" }];
    });

    const user = userEvent.setup();
    render(<SignUp signUp={signUp} login={login} />);

    const username = screen.getByRole("textbox", {
      name: "username",
    });
    const password = screen.getByLabelText(/^Password:/i);
    const passwordConfirmation = screen.getByLabelText(/Confirm Password:/i);

    const button = screen.getByRole("button", { name: "Sign Up" });

    await user.type(username, "test");
    await user.type(password, "test");
    await user.type(passwordConfirmation, "test");
    await user.click(button);

    expect(login).not.toBeCalled();
    expect(await screen.findByText(/test error/i)).toBeVisible();
  });
});
