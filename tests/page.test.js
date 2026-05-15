import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// Mock the LandingPageComponent to avoid deep dependency chains
vi.mock("@/components/LandingPageComponent", () => ({
  default: () => <div data-testid="landing-page">Gauge Landing</div>,
}));

import HomePage from "@/app/page";

describe("HomePage", () => {
  it("renders the LandingPageComponent", () => {
    render(<HomePage />);
    expect(screen.getByTestId("landing-page")).toBeInTheDocument();
  });
});
