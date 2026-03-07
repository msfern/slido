import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Header from "./Header";

describe("Header", () => {
  it("renders the app title", () => {
    render(<Header />);

    expect(screen.getByRole("heading", { name: "slido" })).toBeTruthy();
  });

  it("renders a header element", () => {
    render(<Header />);

    expect(document.querySelector("header")).not.toBeNull();
  });
});
