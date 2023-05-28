import React from "react";
import { render, screen } from "@testing-library/react";
import Users from "../../pages/Users";
import "@testing-library/jest-dom";
import Cookies from "js-cookie";
import { MemoryRouter } from "react-router-dom";

test("Check page without proper login", () => {
  render(
    <MemoryRouter>
      <Users />
    </MemoryRouter>
  );

  const denied = screen.getByText("Access Denied!");
  expect(denied).toBeInTheDocument();
});

jest.mock("js-cookie");

test("Check page with proper login", () => {
  Cookies.get.mockReturnValue("token");
  render(
    <MemoryRouter>
      <Users />
    </MemoryRouter>
  );

  const tables = screen.getAllByRole("table", {
    class: "table table-striped table-bordered table-hover",
  });

  expect(tables).toHaveLength(1);

  jest.clearAllMocks();
});
