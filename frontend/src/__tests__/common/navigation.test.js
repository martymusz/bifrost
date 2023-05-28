import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Navigation from "../../components/common/navigation";
import "@testing-library/jest-dom";

describe("Navigation component", () => {
  test("navigation links", () => {
    render(
      <BrowserRouter>
        <Navigation active={1} />
      </BrowserRouter>
    );

    const navigationLinks = screen.getAllByRole("link");
    expect(navigationLinks).toHaveLength(6);

    expect(navigationLinks[0]).toHaveTextContent("Főoldal");
    expect(navigationLinks[0]).toHaveAttribute("href", "/home");
  });

  test("active class correct", () => {
    render(
      <BrowserRouter>
        <Navigation active={2} />
      </BrowserRouter>
    );

    const activeLink = screen.getByRole("link", { name: "Kapcsolatok" });
    expect(activeLink).toHaveClass("active");
  });

  test("logout link", () => {
    render(
      <BrowserRouter>
        <Navigation active={1} />
      </BrowserRouter>
    );

    const logoutLink = screen.getByRole("link", { name: "Kijelentkezés" });
    expect(logoutLink).toBeInTheDocument();
  });
});
