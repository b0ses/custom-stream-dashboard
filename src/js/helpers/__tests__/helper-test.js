const addTwoNumbers = require('../helper');

describe('addTwoNumbers()', () => {
  it('should add two numbers', () => {
    // 1. ARRANGE
    const x = 5;
    const y = 1;
    const sum1 = x + y;

    // 2. ACT
    const sum2 = addTwoNumbers(x, y);

    // 3. ASSERT
    expect(sum2).toEqual(sum1);
  });
});
