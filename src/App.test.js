import React from 'react';
import { render } from '@testing-library/react';

// Simple component test that doesn't require the full App
test('React testing environment works', () => {
  const TestComponent = () => <div>Test</div>;
  const { getByText } = render(<TestComponent />);
  expect(getByText('Test')).toBeInTheDocument();
});

// Test the streak calculator utility directly
test('streak calculator utility exists', () => {
  // This will test if our new utility can be imported
  const streakCalculator = require('./utils/streakCalculator');
  expect(streakCalculator.calculateStreaks).toBeDefined();
  expect(streakCalculator.getStage).toBeDefined();
  expect(streakCalculator.getStageInfo).toBeDefined();
  expect(streakCalculator.getCongrats).toBeDefined();
});