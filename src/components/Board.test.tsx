import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SOLVED_BOARD } from "@/mocks/testMocks";
import Board from "./Board";

describe("Board", () => {
  afterEach(cleanup);

  it("renders the correct number of interactive tile buttons", () => {
    render(
      <Board
        gridSize={3}
        handleMove={vi.fn()}
        isSolved={false}
        tiles={SOLVED_BOARD}
      />
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(8);
  });

  it("calls handleMove with the correct index when a tile is clicked", () => {
    const handleMove = vi.fn();
    render(
      <Board
        gridSize={3}
        handleMove={handleMove}
        isSolved={false}
        tiles={SOLVED_BOARD}
      />
    );

    fireEvent.click(screen.getByLabelText("Tile 1, row 1, column 1"));
    expect(handleMove).toHaveBeenCalledWith(0);

    fireEvent.click(screen.getByLabelText("Tile 5, row 2, column 2"));
    expect(handleMove).toHaveBeenCalledWith(4);
  });

  it("renders tiles with accessible aria-labels including position", () => {
    render(
      <Board
        gridSize={3}
        handleMove={vi.fn()}
        isSolved={false}
        tiles={SOLVED_BOARD}
      />
    );

    expect(screen.queryByLabelText("Tile 1, row 1, column 1")).not.toBeNull();
    expect(screen.queryByLabelText("Tile 8, row 3, column 2")).not.toBeNull();
  });

  it("has an accessible label describing the board dimensions", () => {
    const { container } = render(
      <Board
        gridSize={3}
        handleMove={vi.fn()}
        isSolved={false}
        tiles={SOLVED_BOARD}
      />
    );

    const board = container.querySelector("section.board");
    expect(board?.getAttribute("aria-label")).toBe("3 by 3 sliding puzzle");
  });

  it("renders the empty tile as a non-interactive aria-hidden element", () => {
    const { container } = render(
      <Board
        gridSize={3}
        handleMove={vi.fn()}
        isSolved={false}
        tiles={SOLVED_BOARD}
      />
    );

    const emptyTile = container.querySelector("[aria-hidden='true']");
    expect(emptyTile).not.toBeNull();
    expect(emptyTile?.tagName).toBe("DIV");
  });

  it("applies the has-won class when the puzzle is solved", () => {
    render(
      <Board
        gridSize={3}
        handleMove={vi.fn()}
        isSolved={true}
        tiles={SOLVED_BOARD}
      />
    );

    const board = document.querySelector(".board");
    expect(board?.className).toContain("has-won");
  });
});
