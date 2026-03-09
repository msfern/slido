import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import Tile from "./Tile";

const TILE_5_LABEL = /tile 5/i;

vi.mock("motion/react", () => ({
  motion: {
    button: ({
      layout: _layout,
      transition: _transition,
      ...props
    }: Record<string, unknown>) => <button {...props} />,
  },
}));

describe("Tile", () => {
  afterEach(cleanup);

  it("renders the tile value for a numbered tile", () => {
    render(
      <Tile gridSize={3} handleMove={vi.fn()} index={0} tile={{ value: 5 }} />
    );

    const button = screen.getByRole("button", { name: TILE_5_LABEL });
    expect(button.textContent).toBe("5");
  });

  it("calls handleMove with the index when clicked", () => {
    const handleMove = vi.fn();
    render(
      <Tile
        gridSize={3}
        handleMove={handleMove}
        index={3}
        tile={{ value: 4 }}
      />
    );

    fireEvent.click(screen.getByRole("button"));

    expect(handleMove).toHaveBeenCalledWith(3);
  });

  it("renders aria-label with position for accessibility", () => {
    render(
      <Tile gridSize={3} handleMove={vi.fn()} index={4} tile={{ value: 5 }} />
    );

    expect(screen.getByLabelText("Tile 5, row 2, column 2")).toBeTruthy();
  });

  it("renders empty tile as non-interactive div with aria-hidden", () => {
    const { container } = render(
      <Tile
        gridSize={3}
        handleMove={vi.fn()}
        index={8}
        tile={{ value: null }}
      />
    );

    const emptyTile = container.querySelector("[aria-hidden='true']");
    expect(emptyTile).not.toBeNull();
    expect(emptyTile?.tagName).toBe("DIV");
    expect(emptyTile?.className).toContain("is-empty");
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("computes row and column correctly for different grid sizes", () => {
    render(
      <Tile gridSize={4} handleMove={vi.fn()} index={5} tile={{ value: 6 }} />
    );

    expect(screen.getByLabelText("Tile 6, row 2, column 2")).toBeTruthy();
  });

  it("should have no axe violations", async () => {
    const { baseElement } = render(
      <Tile gridSize={3} handleMove={vi.fn()} index={0} tile={{ value: 5 }} />
    );
    expect(await axe(baseElement)).toHaveNoViolations();
  });
});
