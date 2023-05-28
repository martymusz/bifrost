import React, { Component } from "react";
import RadioSelect from "../../components/common/radioSelect";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";

describe("RadioSelect", () => {
  test("Check option rendering", () => {
    const handleRadioSelection = jest.fn();
    const options = [
      { id: "option1", value: "option1", label: "Option 1" },
      { id: "option2", value: "option2", label: "Option 2" },
      { id: "option3", value: "option3", label: "Option 3" },
    ];

    render(
      <RadioSelect
        options={options}
        handleRadioSelection={handleRadioSelection}
      />
    );

    const radioInput = screen.getByLabelText("Option 2");
    fireEvent.click(radioInput);
    expect(handleRadioSelection).toHaveBeenCalledWith("option2");

    const optionToSelect = options[1];
    const radioOptionToSelect = screen.getByLabelText(optionToSelect.label);
    fireEvent.click(radioOptionToSelect);

    expect(radioOptionToSelect.checked).toBe(true);
    expect(screen.getByLabelText(optionToSelect.label)).toBeChecked();

    expect(handleRadioSelection).toHaveBeenCalledTimes(1);
    expect(handleRadioSelection).toHaveBeenCalledWith(optionToSelect.value);
  });
});
