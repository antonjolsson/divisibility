import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import App from './App';

test('renders headline', () => {
  render(<App />);
  const headline = screen.getByText('Divisibility');
  expect(headline).toBeInTheDocument();
});

test('renders stroke when number is divisor', () => {
  render(<App />);
  const input = screen.getByLabelText(/number to test/i)
  fireEvent.change(input, {target: {value: 7}})
  const stroke = screen.getByAltText('stroke7')
  expect(stroke).toBeInTheDocument()
});
