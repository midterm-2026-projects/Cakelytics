import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import ProductFormFields, {
  defaultProductFormState,
} from "../../../src/components/ProductManagement/ProductFormFields";

describe("ProductFormFields", () => {
  it("renders all form fields with the provided values", () => {
    const form = {
      name: "Chocolate Cake",
      category: "Dessert",
      price: "120",
      description: "Delicious and moist",
      limit: "50",
    };
    const setForm = vi.fn();

    render(<ProductFormFields form={form} setForm={setForm} />);

    expect(screen.getByRole("textbox", { name: /product name/i })).toHaveValue(
      "Chocolate Cake"
    );
    expect(screen.getByRole("textbox", { name: /category/i })).toHaveValue(
      "Dessert"
    );
    expect(screen.getByRole("spinbutton", { name: /price/i })).toHaveValue(
      120
    );
    expect(screen.getByRole("textbox", { name: /description/i })).toHaveValue(
      "Delicious and moist"
    );
    expect(screen.getByRole("textbox", { name: /limit/i })).toHaveValue("50");
  });

  it("calls setForm with the updated field value when an input changes", () => {
    const form = {
      name: "Chocolate Cake",
      category: "Dessert",
      price: "120",
      description: "Delicious and moist",
      limit: "50",
    };
    const setForm = vi.fn();

    render(<ProductFormFields form={form} setForm={setForm} />);

    const nameInput = screen.getByRole("textbox", { name: /product name/i });
    fireEvent.change(nameInput, { target: { value: "Red Velvet Cake" } });

    expect(setForm).toHaveBeenCalledTimes(1);
    const updateCallback = setForm.mock.calls[0][0];
    expect(typeof updateCallback).toBe("function");

    const nextState = updateCallback(form);
    expect(nextState).toEqual({
      ...form,
      name: "Red Velvet Cake",
    });
  });

  it("returns default empty values when defaultProductFormState is called without a product", () => {
    expect(defaultProductFormState()).toEqual({
      name: "",
      category: "",
      description: "",
      price: "",
      limit: "",
    });
  });

  it("initializes default form state from a product object", () => {
    const product = {
      name: "Plain Cake",
      category: "Bakery",
      description: "Simple vanilla",
      price: 80,
      limit: 20,
    };

    expect(defaultProductFormState(product)).toEqual({
      name: "Plain Cake",
      category: "Bakery",
      description: "Simple vanilla",
      price: 80,
      limit: 20,
    });
  });
});
