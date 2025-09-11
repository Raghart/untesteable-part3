import { describe, test } from "vitest";
import { expect } from "chai";
import { diceHandValue } from "../src/untestable2.mjs";
import { diceRoll, handleDiceValue } from "../src/testeable2.mjs";

describe("Untestable 2: a dice game", () => {
  test("todo", () => {
    // TODO: write proper tests
    expect(diceHandValue()).to.be.a("number");
  });

  test("the diceRoll returns a valid number between 1 and 6", () => {
    expect(diceRoll()).to.be.greaterThanOrEqual(1);
    expect(diceRoll()).to.be.lessThanOrEqual(6);
  });

  test("diceRoll returns a value between 1 and 6 even with 30 throws", () => {
    for (let i=0; i < 30; i++) {
      const diceValue = diceRoll();
      expect(diceValue).to.be.within(1,6);
    };
  });

  test("handleDiceValue returns error if either dice value is not a number", () => {
    expect(() => handleDiceValue("notNUmber",[123])).to.throw("dice values must be numbers");
  });

  test("handleDiceValues returns the correct value when the diceRoll are a pair", () => {
    for (let i = 1; i < 7 ;i++) { expect(handleDiceValue(i,i)).to.equal(100 + i); }
  });

  test("handleDiceValue returns the highest number if the args are not a pair of numbers", () => {
    expect(handleDiceValue(1,3)).to.equal(3);
    expect(handleDiceValue(3,4)).to.equal(4);
    expect(handleDiceValue(5,4)).to.equal(5);
    expect(handleDiceValue(1,6)).to.equal(6);
  });
});
