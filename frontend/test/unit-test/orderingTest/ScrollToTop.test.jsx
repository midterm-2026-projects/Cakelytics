//@vitest-environment jsdom

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router-dom";

import ScrollToTop from "../../../src/components/orderingComponents/ScrollToTop";

// Mock useLocation
const mockLocation = {
  pathname: "/",
};

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useLocation: () => mockLocation,
  };
});

describe("ScrollToTop Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    window.scrollTo = vi.fn();

    global.requestAnimationFrame = (cb) => {
      cb();
      return 1;
    };
  });

  it("should renders without crashing", () => {
    const { container } = render(
      <MemoryRouter>
        <ScrollToTop />
      </MemoryRouter>
    );

    expect(container.firstChild).toBeNull();
  });

  it("should scrolls to the top on pathname change", () => {
    render(
      <MemoryRouter>
        <ScrollToTop />
      </MemoryRouter>
    );

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it("should calls requestAnimationFrame", () => {
    const rafSpy = vi.spyOn(global, "requestAnimationFrame");

    render(
      <MemoryRouter>
        <ScrollToTop />
      </MemoryRouter>
    );

    expect(rafSpy).toHaveBeenCalled();
  });
});