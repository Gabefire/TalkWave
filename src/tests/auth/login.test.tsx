import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Login from "../../components/auth/login.js";
import { server } from "../server.ts";
import { HttpResponse, http } from "msw";

vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useNavigate: () => vi.fn(),
}));

describe("login component", () => {
  it("Renders correct heading", () => {
    render(<Login />);

    const header = screen.getByRole("heading", { name: "Login" });

    expect(header).toBeInTheDocument();
  });

  it("Should set token and username once login", async () => {
    const user = userEvent.setup();
    Storage.prototype.setItem = vi.fn();

    render(<Login />);

    const username = screen.getByRole("textbox", {
      name: "email",
    });

    const password = screen.getByLabelText(/Password:/i);

    const button = screen.getByRole("button", { name: "Login" });
    await user.type(username, "test");
    await user.type(password, "test");
    await user.click(button);

    expect(localStorage.setItem).toHaveBeenCalled();
  });
  it("When fields are empty login will not run and required fields should be in document", async () => {
    const user = userEvent.setup();

    render(<Login />);

    const button = screen.getByRole("button", { name: "Login" });

    await user.click(button);
    expect(await screen.findByText(/Email is Required/i)).toBeVisible();
    expect(await screen.findByText(/Password is Required/i)).toBeVisible();
  });

  it("Error shows if login api fails", async () => {
    server.use(
      http.post("/api/User/login", () => {
        return HttpResponse.error();
      })
    );

    const user = userEvent.setup();
    render(<Login />);

    const username = screen.getByRole("textbox", {
      name: "email",
    });

    const password = screen.getByLabelText(/Password:/i);

    const button = screen.getByRole("button", { name: "Login" });
    await user.type(username, "test");
    await user.type(password, "test");
    await user.click(button);

    expect(await screen.findByText(/undefined/i)).toBeVisible();
  });
});
