import { render, screen } from "@testing-library/react";
import { LabelMother } from "./LabelMother";

describe("Label suite", () => {
  it("should render", async () => {
    render(LabelMother.create());

    const label = await screen.findByText("Test Label");

    expect(label).toBeInTheDocument();
  });

  it("should have given text", async () => {
    const text = "Form field";
    render(LabelMother.create({ children: text }));

    const label = await screen.findByText(text);

    expect(label).toBeInTheDocument();
  });

  // it("should have required feedback", async () => {
  //   const text = "Form field";
  //   render(LabelMother.create({ children: text, required: true }));

  //   const label = await screen.findByText(text);
  //   const afterContent = getComputedStyle(label, "::after").getPropertyValue("content");

  //   expect(afterContent).toBe(" *");
  // });
});
