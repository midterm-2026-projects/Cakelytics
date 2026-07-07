import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { AddProductModal } from "../../../src/components/ProductManagement/AddProductModal";
import { UpdateProductModal } from "../../../src/components/ProductManagement/UpdateProductModal";

describe("Product Management modals", () => {
  it("should render the add-product modal and saves the form data", async () => {
    const onClose = vi.fn();
    const onSave = vi.fn();

    render(<AddProductModal onClose={onClose} onSave={onSave} />);

    expect(screen.getByRole("heading", { name: /add product/i })).toBeInTheDocument();
    expect(screen.getByText("Close")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save changes/i })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /save changes/i }));

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({
      name: "",
      category: "",
      description: "",
      price: "",
      limit: "",
    }));
  });

  it("should close the add-product modal without saving when close is clicked", async () => {
    const onClose = vi.fn();
    const onSave = vi.fn();

    render(<AddProductModal onClose={onClose} onSave={onSave} />);

    await userEvent.click(screen.getByText("Close"));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onSave).not.toHaveBeenCalled();
  });

  it("should render the update-product modal with the product order id and triggers delete/save actions", async () => {
    const onClose = vi.fn();
    const onSave = vi.fn();
    const onDelete = vi.fn();
    const product = { orderId: "ORD-2048", name: "Birthday Cake" };

    render(
      <UpdateProductModal
        product={product}
        onClose={onClose}
        onSave={onSave}
        onDelete={onDelete}
      />
    );

    expect(screen.getByText("#ORD-2048")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete product/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save changes/i })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /delete product/i }));
    await userEvent.click(screen.getByRole("button", { name: /save changes/i }));

    expect(onDelete).toHaveBeenCalledWith(product);
    expect(onSave).toHaveBeenCalledTimes(1);
  });
});
