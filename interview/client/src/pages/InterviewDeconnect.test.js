// import React from 'react';
// import { render } from '@testing-library/react';
// import App from './App';

// test('ad', () => {
//   expect(sum(1, 2)).toBe(3);
// });

test('zero', () => {
  const addition = 0 + 0;

  expect(addition).not.toBeNull();
  expect(addition).toBeDefined();
  expect(addition).not.toBeUndefined();
  expect(addition).not.toBeTruthy();
  expect(addition).toBeFalsy();
});
