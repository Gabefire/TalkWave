import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import MainPage from "../../components/auth/main_page";
const mockUsedNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useNavigate: () => mockUsedNavigate,
}));

describe("Main page component", () => {
  it("header is present", async () => {
    const login = vi.fn();

    render(<MainPage login={login} />);

    const header = screen.getByRole("heading", { name: "Welcome to TalkWave" });

    expect(header).toBeInTheDocument();
  });

  it("logins in when continue as guest is selected", async () => {
    const user = userEvent.setup();
    const login = vi.fn();

    render(<MainPage login={login} />);

    const link = screen.getByRole("link", { name: "Continue as Guest" });

    await user.click(link);

    expect(login).toBeCalled();
  });
});
