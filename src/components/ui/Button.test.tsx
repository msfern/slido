import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import Button from "@/components/ui/Button";

describe("Button", () => {
  const onClick = vi.fn();
  afterEach(cleanup);

  it("renders children", () => {
    render(<Button onClick={onClick}>Click me</Button>);

    expect(screen.getByRole("button", { name: "Click me" })).toBeTruthy();
  });

  it("calls onClick when clicked", () => {
    render(<Button onClick={onClick}>New Game</Button>);

    fireEvent.click(screen.getByRole("button", { name: "New Game" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders as a button element with type button", () => {
    render(<Button onClick={onClick}>Submit</Button>);

    const btn = screen.getByRole("button", { name: "Submit" });
    expect(btn.getAttribute("type")).toBe("button");
  });

  it("should have no axe violations", async () => {
    const { baseElement } = render(<Button onClick={onClick}>Submit</Button>);
    expect(await axe(baseElement)).toHaveNoViolations();
  });
});
