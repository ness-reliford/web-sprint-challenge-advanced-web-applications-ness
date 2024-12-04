// Import the Spinner component into this file and test
import { render, screen } from "@testing-library/react"
import '@testing-library/jest-dom'
import Spinner from "./Spinner"
import React from "react"

// that it renders what it should for the different props it can take.
// test('sanity', () => {
//   expect(true).toBe(false)
// })

describe('Spinner Component', () => {
  it('should render the spinner when on is true', () => {
    render(<Spinner on={true} />);

    const spinner = screen.getByTestId('spinner')
    expect(spinner).toBeInTheDocument();
  }); 

  it('should not render the spinner when on is false', () => {
    render(<Spinner on={false} />);

    const spinner = screen.queryByTestId('spinner')
    expect(spinner).not.toBeInTheDocument()

  });
})