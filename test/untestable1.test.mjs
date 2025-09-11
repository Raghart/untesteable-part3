import { describe, test } from "vitest";
import { expect } from "chai";
import { daysUntilChristmas } from "../src/untestable1.mjs";
import { daysUntilChristmasFixed } from "../src/testeable1.mjs";
import { Temporal } from "@js-temporal/polyfill";

describe("Untestable 1: days until Christmas", () => {
  test("todo", () => {
    // TODO: write proper tests
    expect(daysUntilChristmas()).to.be.a("number");
  });

  test("it returns the correct number of days until christmas from 11-9-2025", () => {
    const currentDate = Temporal.PlainDate.from("2025-09-11");
    expect(daysUntilChristmasFixed(currentDate)).to.equal(105);
  });

  test("it returns exception when a not valid Temporal PlainDate is passed", () => {
    const dummyDate = {};
    expect(() => daysUntilChristmasFixed(dummyDate)).to.throw("Expected a Temporal.PlainDate");
  });

  test("it returns the days missing until the christmas of the next year if date is past christmas", () => {
    const pastChristmasDate = Temporal.PlainDate.from("2025-12-26");
    expect(daysUntilChristmasFixed(pastChristmasDate)).to.equal(364);
  });
});
