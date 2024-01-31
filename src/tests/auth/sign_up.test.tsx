import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import SignUp from "../../components/auth/sign_up";
import { server } from "../server";
import { HttpResponse, http } from "msw";

const mockUsedNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useNavigate: () => mockUsedNavigate,
}));

describe("Sign Up Component", () => {
  it("renders correct heading", () => {
    render(<SignUp />);

    const header = screen.getByRole("heading", { name: "Sign Up" });

    expect(header).toBeInTheDocument();
  });

  it("When fields are empty sign up will not run and errors will display", async () => {
    const user = userEvent.setup();

    render(<SignUp />);

    const button = screen.getByRole("button", { name: "Sign Up" });

    await user.click(button);

    expect(await screen.findByText(/Username is Required/i)).toBeVisible();
    expect(await screen.findByText(/Password is Required/i)).toBeVisible();
    expect(
      await screen.findByText(/Password Confirmation is Required/i)
    ).toBeVisible();
  });

  it("Call sign up function and login with fields filled out", async () => {
    const user = userEvent.setup();
    Storage.prototype.setItem = vi.fn();

    render(<SignUp />);

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

    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it("Error shows if login api fails", async () => {
    server.use(
      http.post("/api/User/login", () => {
        return HttpResponse.error();
      })
    );

    const user = userEvent.setup();
    render(<SignUp />);

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

    expect(await screen.findByText(/undefined/i)).toBeVisible();
  });

  it("error should show if sign up api fails", async () => {
    server.use(
      http.post("/api/User/register", () => {
        return HttpResponse.error();
      })
    );
    const user = userEvent.setup();
    render(<SignUp />);

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
    expect(await screen.findByText(/Bad Connection/i)).toBeVisible();
  });
});
