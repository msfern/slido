import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Controls from "./Controls";

const NEW_GAME_BUTTON = /new game/i;

describe("Controls", () => {
  afterEach(cleanup);

  it("renders the move count", () => {
    render(
      <Controls moves={42} onGridSizeChange={vi.fn()} resetGame={vi.fn()} />
    );

    expect(screen.getByText("42")).toBeTruthy();
  });

  it("renders the New Game button", () => {
    render(
      <Controls moves={0} onGridSizeChange={vi.fn()} resetGame={vi.fn()} />
    );

    expect(screen.getByRole("button", { name: NEW_GAME_BUTTON })).toBeTruthy();
  });

  it("calls resetGame when New Game is clicked", () => {
    const resetGame = vi.fn();
    render(
      <Controls moves={5} onGridSizeChange={vi.fn()} resetGame={resetGame} />
    );

    fireEvent.click(screen.getByRole("button", { name: NEW_GAME_BUTTON }));

    expect(resetGame).toHaveBeenCalledTimes(1);
  });

  it("renders the move counter with aria-live", () => {
    const { container } = render(
      <Controls moves={0} onGridSizeChange={vi.fn()} resetGame={vi.fn()} />
    );

    const output = container.querySelector("output[aria-live='polite']");
    expect(output).not.toBeNull();
  });
});
