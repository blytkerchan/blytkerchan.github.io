import { Toaster } from "./Toaster";
import { render, screen } from "@testing-library/react";

describe("Toaster component", () => {
  it("is not visible when not shown", async () => {
    const error = {
      show: false,
      title: "TheTitle",
      message: "TheMessage",
    };
    function clearError() {
      error.show = false;
    }
    function useError() {
      return {error, clearError};
    }

    render(<Toaster useError={useError} />);
    // Note: we test by querying for the title being in the document, because that should not be rendered if the
    // Toaster is not shown, and we don't have a good (user-visible) element to look for otherwise
    const titleSpan = screen.queryByTestId("toasterTitle");

    expect(titleSpan).not.toBeInTheDocument();
  });
  it("is visible when given an error that's shown", async () => {
    const error = {
      show: true,
      title: "TheTitle",
      message: "TheMessage",
    };
    function clearError() {
      error.show = false;
    }
    function useError() {
      return {error, clearError};
    }
    render(<Toaster useError={useError} />);
    const titleSpan = screen.queryByTestId("toasterTitle");

    expect(titleSpan).toBeVisible();
  });
});
