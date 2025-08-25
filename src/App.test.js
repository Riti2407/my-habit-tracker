import { render, screen } from '@testing-library/react';
import App from './App';

test('renders navbar title', () => {
  render(<App />);
  const element = screen.getByText(/habit tracker/i);
  expect(element).toBeInTheDocument();
});
