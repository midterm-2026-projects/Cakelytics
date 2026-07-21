import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AllOrdersPage from "../../../src/pages/AllOrdersPage/AllOrdersPage";

vi.mock("../../../src/components/AllOrdersComponents/Ordersearchbar", () => ({
  default: () => <div data-testid="mock-searchbar" />,
}));

vi.mock("../../../src/components/AllOrdersComponents/Orderstatusfilter", () => ({
  default: () => <div data-testid="mock-filter" />,
}));

// Note: AllOrdersPage currently renders the table inline, so this mock is not expected
// to appear in the DOM. Kept for compatibility with the original test structure.
vi.mock("../../../src/components/AllOrdersComponents/Orderstable", () => ({
  default: () => <div data-testid="mock-table" />,
}));

vi.mock("../../../src/components/AllOrdersComponents/Orderspagination", () => ({
  default: () => <div data-testid="mock-pagination" />,
}));

describe("AllOrdersPage Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it("renders loading state correctly", async () => {
    fetch.mockImplementation(() => new Promise(() => {}));

    render(<AllOrdersPage />);

    expect(await screen.findByText(/Loading orders from database/i)).toBeInTheDocument();
  });

  it("renders child components after data is fetched", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify({ success: true, data: [] }),
    });

    render(<AllOrdersPage />);

    expect(await screen.findByTestId("mock-searchbar")).toBeInTheDocument();
    expect(await screen.findByTestId("mock-filter")).toBeInTheDocument();
    expect(await screen.findByTestId("mock-pagination")).toBeInTheDocument();
    // Orderstable is not rendered as a separate component — table is rendered inline in AllOrdersPage
  });

  it("renders the inline table with order data from the API", async () => {
    const mockOrders = [
      {
        id: "ord-001",
        order_number: "ORD-1001",
        customer_name: "Maria Santos",
        phone_number: "09171234567",
        order_type: "Pre-Order",
        grand_total: 2500,
        payment_type: "full",
        status: "Confirmed",
        pickup_date: "2026-07-20",
        pickup_time: "14:00",
      },
      {
        id: "ord-002",
        order_number: "ORD-1002",
        customer_name: "Juan Dela Cruz",
        phone_number: "09189876543",
        order_type: "Buy Now",
        grand_total: 850,
        payment_type: "deposit",
        status: "Ready",
        pickup_date: "2026-07-19",
        pickup_time: "10:30",
      },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify({ success: true, data: mockOrders }),
    });

    render(<AllOrdersPage />);

    // Wait for table rows to appear (loading finishes)
    const row1 = await screen.findByText(/ORD-1001/);
    expect(row1).toBeInTheDocument();

    // Assert first order data appears in the table
    expect(screen.getByText(/Maria Santos/)).toBeInTheDocument();
    expect(screen.getByText(/Pre-Order/)).toBeInTheDocument();
    expect(screen.getByText(/Confirmed/)).toBeInTheDocument();

    // Assert second order data appears
    expect(screen.getByText(/ORD-1002/)).toBeInTheDocument();
    expect(screen.getByText(/Juan Dela Cruz/)).toBeInTheDocument();
    expect(screen.getByText(/Buy Now/)).toBeInTheDocument();
    expect(screen.getByText(/Ready/)).toBeInTheDocument();

    // Assert deposit payment display for second order
    expect(screen.getByText(/Deposit/)).toBeInTheDocument();
    expect(screen.getByText(/Balance/)).toBeInTheDocument();

    // Assert "Fully Paid" appears for first order (payment_type: "full")
    expect(screen.getByText(/Fully Paid/)).toBeInTheDocument();

    // Assert there are two "View Details" buttons (one per row)
    const viewButtons = screen.getAllByText("View Details");
    expect(viewButtons).toHaveLength(2);
  });

  it("displays error message on fetch failure", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      text: async () => JSON.stringify({ message: "Server Error" }),
    });

    render(<AllOrdersPage />);

    expect(await screen.findByText(/Server Error/i)).toBeInTheDocument();
  });
});
