import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Button from "./Button";

describe("Button", () => {
  afterEach(cleanup);

  it("renders children", () => {
    render(<Button onClick={vi.fn()}>Click me</Button>);

    expect(screen.getByRole("button", { name: "Click me" })).toBeTruthy();
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>New Game</Button>);

    fireEvent.click(screen.getByRole("button", { name: "New Game" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders as a button element with type button", () => {
    render(<Button onClick={vi.fn()}>Submit</Button>);

    const btn = screen.getByRole("button", { name: "Submit" });
    expect(btn.getAttribute("type")).toBe("button");
  });
});
