// import { render, screen } from '@testing-library/react';
// import App from './App';

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

import { render, screen } from '@testing-library/react';
import App from './App';

test('renders habit tracker title', () => {
  render(<App />);
  const titleElement = screen.getByText(/habit tracker/i);
  expect(titleElement).toBeInTheDocument();
});