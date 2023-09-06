import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import Login from "../../components/auth/login.js";

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

    render(<Login login={login} />);
    (
      screen.getByRole("textbox", { name: "username" }) as HTMLInputElement
    ).value = "test";
    (
      screen.getByRole("textbox", { name: "password" }) as HTMLInputElement
    ).value = "test";

    const button = screen.getByRole("button", { name: "Login" });

    await user.click(button);

    expect(login).toHaveBeenCalled();
  });
  it("when fields are empty login should not run and required fileds should be in", async () => {
    const login = vi.fn();
    const user = userEvent.setup();

    render(<Login login={login} />);

    const button = screen.getByRole("button", { name: "Login" });

    await user.click(button);

    expect(login).not.toHaveBeenCalled();
    expect(await screen.findByText("User Name Required")).toBeVisible();
    expect(await screen.findByText("Password Required")).toBeVisible();
  });
  it("error should show if login api fails", async () => {
    const login = vi.fn(() => {
      return new Error("test");
    });
    const user = userEvent.setup();
    render(<Login login={login} />);
    (
      screen.getByRole("textbox", { name: "username" }) as HTMLInputElement
    ).value = "test";
    (
      screen.getByRole("textbox", { name: "password" }) as HTMLInputElement
    ).value = "test";

    const button = screen.getByRole("button", { name: "Login" });

    await user.click(button);
    expect(login).toHaveBeenCalled();
    expect(await screen.findByText("test")).toBeVisible();
  });
});
