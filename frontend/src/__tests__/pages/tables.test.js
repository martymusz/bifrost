import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Tables from "../../pages/Tables";
import { MemoryRouter } from "react-router-dom";
import Cookies from "js-cookie";

jest.mock("js-cookie");

test("Check page with proper login", () => {
  Cookies.get.mockReturnValue("token");
  render(
    <MemoryRouter>
      <Tables />
    </MemoryRouter>
  );

  const add = screen.getByRole("button", {
    name: "+ Új adattábla",
  });
  expect(add).toBeInTheDocument();

  const tables = screen.getAllByRole("table", {
    class: "table table-striped table-bordered table-hover",
  });

  expect(tables).toHaveLength(1);

  jest.clearAllMocks();
});
