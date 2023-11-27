// import { add } from '../test functions/add.js'; // Replace with the actual path to your module
const add = require('../test functions/add.js'); // Replace with the actual path to your module
test('adds 1 + 2 to equal 3', () => {
  expect(add(1, 2)).toBe(3);
});