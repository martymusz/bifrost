import React from "react";
import { render, screen } from "@testing-library/react";
import CustomTable from "../../components/common/customTable";
import "@testing-library/jest-dom";

describe("CustomTable", () => {
  const headers = ["owner_id", "task_id", "table_id"];
  const data = [
    { owner_id: 1, task_id: 101, table_id: 201 },
    { owner_id: 2, task_id: 102, table_id: 202 },
  ];
  const pretty_names = ["Owner ID", "Task ID", "Table ID"];

  test("Check table render", () => {
    render(
      <CustomTable
        headers={headers}
        data={data}
        pretty_names={pretty_names}
        showDeleteButton={true}
        showEditButton={true}
        onDelete={() => {}}
        onModify={() => {}}
      />
    );

    pretty_names.forEach((header) => {
      const headerElement = screen.getByText(header);
      expect(headerElement).toBeInTheDocument();
    });

    data.forEach((row) => {
      Object.values(row).forEach((value) => {
        const cellElement = screen.getByText(String(value));
        expect(cellElement).toBeInTheDocument();
      });
    });
  });

  test("Delete buttons are rendered", () => {
    render(
      <CustomTable
        headers={headers}
        data={data}
        pretty_names={pretty_names}
        showDeleteButton={true}
        showEditButton={false}
        onDelete={() => {}}
        onModify={() => {}}
      />
    );

    const deleteButtons = screen.getAllByRole("button");
    expect(deleteButtons.length).toBe(data.length);
  });

  test("Edit buttons are rendered", () => {
    render(
      <CustomTable
        headers={headers}
        data={data}
        pretty_names={pretty_names}
        showDeleteButton={false}
        showEditButton={true}
        onDelete={() => {}}
        onModify={() => {}}
      />
    );

    const deleteButtons = screen.getAllByRole("button");
    expect(deleteButtons.length).toBe(data.length);
  });
});
