import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import Footer from "./Footer";

const ATTRIBUTION = /made by stephanie fernandes/i;

describe("Footer", () => {
  afterEach(cleanup);

  it("renders the attribution text", () => {
    render(<Footer />);

    expect(screen.getByText(ATTRIBUTION)).toBeTruthy();
  });

  it("renders the current year", () => {
    const { container } = render(<Footer />);

    const year = new Date().getFullYear();
    const footer = container.querySelector("footer");
    expect(footer?.textContent).toContain(String(year));
  });

  it("renders a footer element", () => {
    const { container } = render(<Footer />);

    expect(container.querySelector("footer")).not.toBeNull();
  });
});
