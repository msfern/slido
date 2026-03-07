import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import WinBanner from "./WinBanner";

const SOLVED_ONE = /solved in 1 move!/i;
const SOLVED_MANY = /solved in 42 moves!/i;

describe("WinBanner", () => {
  it("displays singular move when moves is 1", () => {
    render(<WinBanner moves={1} />);

    expect(screen.getByText(SOLVED_ONE)).toBeTruthy();
  });

  it("displays plural moves when moves is greater than 1", () => {
    render(<WinBanner moves={42} />);

    expect(screen.getByText(SOLVED_MANY)).toBeTruthy();
  });

  it("uses an output element with aria-live assertive", () => {
    render(<WinBanner moves={5} />);

    const output = document.querySelector("output[aria-live='assertive']");
    expect(output).not.toBeNull();
  });
});
