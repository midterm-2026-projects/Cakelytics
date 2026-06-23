import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import HamburgerMenu from "../src/components/HamburgerMenu.jsx";

describe("Functional hamburger menu for mobile device", () => {
  it("should call onMenuClick when the hamburger icon is clicked", () => {
    const onMenuClick = vi.fn();
    render(<HamburgerMenu onMenuClick={onMenuClick} />);

    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));

    expect(onMenuClick).toHaveBeenCalledTimes(1);
  });
});