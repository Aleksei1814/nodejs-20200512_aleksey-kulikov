function sum(a, b) {
  if (typeof a === 'number' && typeof b === 'number') {
    return a + b;
  }
  throw new TypeError(`
    ${typeof a !== 'number' ? 'type "a" not Number' : ''}
    ${typeof b !== 'number' ? 'type "b" not Number' : ''}
  `, 'sum.js', 2);
}

module.exports = sum;
