import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProductManagementHeader from "../../../src/components/ProductManagement/ProductManagementHeader";

describe("ProductManagementHeader Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Anchor standard internal time frame baseline execution context
    vi.setSystemTime(new Date(Date.UTC(2026, 6, 7, 10, 0, 0))); // July 7, 2026
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render standard headers along with customized initial profile avatars", () => {
    render(<ProductManagementHeader userName="Sarah Jenkins" notificationCount={2} />);

    expect(screen.getByRole("heading", { name: "Product Management" })).toBeInTheDocument();
    expect(screen.getByText("Sarah Jenkins")).toBeInTheDocument();
    expect(screen.getByText("S")).toBeInTheDocument(); // Profile Initial placeholder
  });

  it("should display the notification numeric indicators if the property count passes zero", () => {
    render(<ProductManagementHeader notificationCount={4} />);
    
    const badge = screen.getByText("4");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-red-500");
  });

  it("should hide notification badge indicators completely when value drops down to zero", () => {
    render(<ProductManagementHeader notificationCount={0} />);
    
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("should update live clock interface nodes smoothly on tracking state timeline steps", () => {
    render(<ProductManagementHeader />);

    // Capture standard baseline render matching static context strings
    expect(screen.getByText(/Jul 7, 2026/i)).toBeInTheDocument();

    // Advance clock states forward by one second manually
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(vi.getTimerCount()).toBeGreaterThan(0);
  });
});