import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import DropDown from "../../components/common/dropDown";

describe("DropDown", () => {
  test("Checks rendering and selection", () => {
    const handleSelection = jest.fn();

    const options = [
      { key: "1", label: "Option 1" },
      { key: "2", label: "Option 2" },
      { key: "3", label: "Option 3" },
    ];

    render(<DropDown options={options} handleSelection={handleSelection} />);

    act(() => {
      const dropdownToggle = screen.getByRole("button");
      dropdownToggle.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    act(() => {
      const dropdownItem = screen.getByRole("button", { name: "Option 2" });
      dropdownItem.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(handleSelection).toHaveBeenCalledWith("2");
  });
});
