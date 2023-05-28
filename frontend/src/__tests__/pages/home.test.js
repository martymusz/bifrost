import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "../../pages/Home";
import "@testing-library/jest-dom";
import Cookies from "js-cookie";
import { MemoryRouter } from "react-router-dom";

test("Check page without proper login", () => {
  render(<Home />);

  const denied = screen.getByText("Access Denied!");
  expect(denied).toBeInTheDocument();
});

jest.mock("js-cookie");

test("Check page with proper login", () => {
  Cookies.get.mockReturnValue("token");
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

  const welcome = screen.getByText("Profilod:");
  expect(welcome).toBeInTheDocument();

  const passwordReset = screen.getByRole("button", {
    name: "Jelszó megváltoztatása",
  });
  expect(passwordReset).toBeInTheDocument();

  const tables = screen.getAllByRole("table", {
    class: "table table-striped table-bordered table-hover",
  });

  expect(tables).toHaveLength(2);

  jest.clearAllMocks();
});
