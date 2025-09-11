function diceRoll() {
  const min = 1;
  const max = 6;
  return Math.floor(Math.random() * (max + 1 - min) + min);
}
// Because this function relies on randomness, it's hard to ensure that a specific test will always pass
// with X pair of values. For example, the test to prove that the pair gives more points will 
// be really hard to pass, because a pair happens only by chance, while the test of the "else" has a small chance 
// to get a pair and don't get the expected value.
export function diceHandValue() {
  const die1 = diceRoll();
  const die2 = diceRoll();
  if (die1 === die2) {
    // one pair
    return 100 + die1;
  } else {
    // high die
    return Math.max(die1, die2);
  }
}
