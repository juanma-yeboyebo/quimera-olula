import { fireEvent, render, screen } from "@testing-library/react";
import { ButtonMother } from "./ButtonMother";

describe("Button suite", () => {
  it("should render", async () => {
    render(ButtonMother.create());

    const button = await screen.findByRole("button");

    expect(button).toBeInTheDocument();
  });

  it("should have given text", async () => {
    const text = "Run action";
    render(ButtonMother.create({ children: text }));

    const button = await screen.findByText(text);

    expect(button).toBeInTheDocument();
  });

  it("should execute onClick action", async () => {
    let value = 0;
    render(ButtonMother.create({ onClick: () => (value += 1) }));

    const button = await screen.findByRole("button");
    fireEvent.click(button);

    expect(value).toBe(1);
  });

  it("should not execute onClick on disabled", async () => {
    let value = 0;
    render(ButtonMother.create({ disabled: true, onClick: () => (value += 1) }));

    const button = await screen.findByRole("button");
    fireEvent.click(button);

    expect(value).toBe(0);
  });
});
