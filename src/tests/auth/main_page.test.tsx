import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import MainPage from "../../components/auth/main_page";

const mockUsedNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useNavigate: () => mockUsedNavigate,
  Link: () => vi.fn(),
}));

describe("Main page component", () => {
  it("header is present", () => {
    const login = vi.fn();

    render(<MainPage login={login} />);

    const header = screen.getByRole("heading", { name: "Welcome to TalkWave" });

    expect(header).toBeInTheDocument();
  });
});
