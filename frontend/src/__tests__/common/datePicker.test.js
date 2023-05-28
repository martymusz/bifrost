import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DatePicker from "../../components/common/datePicker";
import "@testing-library/jest-dom";
import moment from "moment";

describe("DatePicker", () => {
  test("Check render and date change", () => {
    const handleDateChange = jest.fn();

    render(<DatePicker handleDateChange={handleDateChange} />);

    const datePickerInput = screen.getByPlaceholderText(
      "Kérlek válassz dátumot!"
    );

    fireEvent.change(datePickerInput, {
      target: { value: "2023-05-20 14:30" },
    });

    const expectedDate = "2023-05-20 14:30";
    const receivedDate = handleDateChange.mock.calls[0][0];
    const formattedReceivedDate =
      moment(receivedDate).format("YYYY-MM-DD HH:mm");

    expect(formattedReceivedDate).toEqual(expectedDate);
  });
});
