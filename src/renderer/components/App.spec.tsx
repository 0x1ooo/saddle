import { render } from '@testing-library/react';
import React from 'react';
import renderer from 'react-test-renderer';
import App from './App';

test('app page matches previous snapshot', () => {
  const component = renderer.create(<App />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('app page have an nice title', () => {
  const { getByText } = render(<App />);
  const titleEl = getByText('Ready to go! 🍻️');
  expect(titleEl).toBeTruthy();
});
