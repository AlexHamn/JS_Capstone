import count from './index';

beforeEach(() => {
  document.body.innerHTML = '<ul id = "works">'
    + '<li></li><li></li></ul>';
});

describe('Should return items length', () => {
  test('Checks for items length', () => {
    expect(count()).toBe(2);
  });
});

// test('return something', () => {
//   expect(count()).toBe(12);
// })