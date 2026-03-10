import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import GridSizeSelector from "./GridSizeSelector";

const LEGEND_GRID_SIZE = /select a grid size/i;

describe("GridSizeSelector", () => {
  afterEach(cleanup);

  it("renders radio options for 3x3, 4x4, and 5x5", () => {
    render(<GridSizeSelector gridSize={3} onGridSizeChange={vi.fn()} />);

    expect(screen.getByLabelText("3×3")).toBeTruthy();
    expect(screen.getByLabelText("4×4")).toBeTruthy();
    expect(screen.getByLabelText("5×5")).toBeTruthy();
  });

  it("calls onGridSizeChange when a different size is selected", () => {
    const onGridSizeChange = vi.fn();
    render(
      <GridSizeSelector gridSize={3} onGridSizeChange={onGridSizeChange} />
    );

    fireEvent.click(screen.getByLabelText("4×4"));

    expect(onGridSizeChange).toHaveBeenCalledWith(4);
  });

  it("has a legend describing the fieldset", () => {
    render(<GridSizeSelector gridSize={3} onGridSizeChange={vi.fn()} />);

    expect(screen.getByText(LEGEND_GRID_SIZE)).toBeTruthy();
  });

  it("renders a fieldset with aria-label", () => {
    render(<GridSizeSelector gridSize={3} onGridSizeChange={vi.fn()} />);

    expect(screen.getByLabelText("Grid size selector")).toBeTruthy();
  });

  it("should have no axe violations", async () => {
    const { baseElement } = render(
      <main>
        <GridSizeSelector gridSize={3} onGridSizeChange={vi.fn()} />
      </main>
    );
    expect(await axe(baseElement)).toHaveNoViolations();
  });
});
