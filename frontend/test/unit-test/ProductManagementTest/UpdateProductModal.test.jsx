import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { UpdateProductModal } from "../../../src/components/ProductManagement/UpdateProductModal";

describe("UpdateProductModal", () => {
  it("should render the order id and action buttons", () => {
    const product = { orderId: "ORD-2048", name: "Birthday Cake" };

    render(
      <UpdateProductModal
        product={product}
        onClose={vi.fn()}
        onSave={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText("#ORD-2048")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete product/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save changes/i })).toBeInTheDocument();
    expect(screen.getByText("Close")).toBeInTheDocument();
  });

  it("should call delete and save callbacks when their buttons are clicked", async () => {
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

    await userEvent.click(screen.getByRole("button", { name: /delete product/i }));
    await userEvent.click(screen.getByRole("button", { name: /save changes/i }));

    expect(onDelete).toHaveBeenCalledWith(product);
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("should call onClose when the close button is clicked", async () => {
    const onClose = vi.fn();

    render(
      <UpdateProductModal
        product={{ orderId: "ORD-3001", name: "Cupcake Box" }}
        onClose={onClose}
        onSave={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    await userEvent.click(screen.getByText("Close"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
