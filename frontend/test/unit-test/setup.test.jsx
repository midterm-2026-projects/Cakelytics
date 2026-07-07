import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom"; // Idinagdag muli ito
import App from "../../src/App";

// Mock para sa localStorage para hindi mag-crash ang App o LoginPage kapag nag-load
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    clear: () => { store = {}; },
    removeItem: (key) => { delete store[key]; },
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("Frontend Structure", () => {
  it("should run without crashing", () => {
    expect(() => {
      // Dito natin ibabalot ang App sa BrowserRouter para makuha nito ang tamang context
      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      );
    }).not.toThrow();
  });
});