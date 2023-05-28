import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CustomAlert from "../../components/common/alert";
import "@testing-library/jest-dom";

describe("CustomAlert", () => {
  test("Check render and close", () => {
    const handleCloseModal = jest.fn();
    const message = "This is an alert message";
    const variant = "success";

    render(
      <CustomAlert
        message={message}
        variant={variant}
        handleCloseModal={handleCloseModal}
      />
    );

    const alertMessage = screen.getByText(message);
    expect(alertMessage).toBeInTheDocument();

    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass(`alert-${variant}`);

    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);
  });
});
