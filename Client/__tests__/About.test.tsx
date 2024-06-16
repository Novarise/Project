import About from "@/app/(routes)/about/page";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

describe("About Us", () => {
  beforeEach(() => {
    render(<About />);
  });

  it("should render About Us heading", () => {
    const heading = screen.getByText("About Us");
    expect(heading).toBeInTheDocument();
  });

  it("should render Welcome to Our Coffee Shop section", () => {
    const sectionHeading = screen.getByText("Welcome to Our Coffee Shop");
    expect(sectionHeading).toBeInTheDocument();
  });

  it("should render Our Mission section", () => {
    const sectionHeading = screen.getByText("Our Mission");
    expect(sectionHeading).toBeInTheDocument();
  });

  it("should render Our Team section", () => {
    const sectionHeading = screen.getByText("Our Team");
    expect(sectionHeading).toBeInTheDocument();
  });

  it("should render Our Journey section", () => {
    const sectionHeading = screen.getByText("Our Journey");
    expect(sectionHeading).toBeInTheDocument();
  });

  it("should render Go back button", () => {
    const button = screen.getByText("Go back");
    expect(button).toBeInTheDocument();
  });
});
