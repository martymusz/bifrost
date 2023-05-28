import React from "react";
import { render, screen } from "@testing-library/react";
import Tasks from "../../pages/Tasks";
import "@testing-library/jest-dom";
import Cookies from "js-cookie";
import { MemoryRouter } from "react-router-dom";

test("Check page without proper login", () => {
  render(
    <MemoryRouter>
      <Tasks />
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
      <Tasks />
    </MemoryRouter>
  );

  const passwordReset = screen.getByRole("button", {
    name: "+ Új töltés",
  });
  expect(passwordReset).toBeInTheDocument();

  const tables = screen.getAllByRole("table", {
    class: "table table-striped table-bordered table-hover",
  });

  expect(tables).toHaveLength(1);

  jest.clearAllMocks();
});
