import { asset } from './assets-helper';

test('asset() returns empty path when given an empty string', () => {
  expect(asset('')).toBe('');
});
test('asset() throws when given a relative path', () => {
  expect(() => asset('./relative-path')).toThrow();
  expect(() => asset('relative-path')).toThrow();
});
