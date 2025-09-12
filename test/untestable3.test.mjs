import { beforeEach, describe, test } from "vitest";
import { expect } from "chai";
import { parsePeopleCsv } from "../src/untestable3.mjs";
import { getCSVPeople, normalizePeoples } from "../src/testeable3.mjs";

// example input:
// Loid,Forger,,Male
// Anya,Forger,6,Female
// Yor,Forger,27,Female

describe("Untestable 3: CSV file parsing", () => {
  let peoples;

  beforeEach(() => {
    peoples = [
      [ 'Loid', 'Forger', '', 'Male' ],
      [ 'Anya', 'Forger', '6', 'Female' ],
      [ 'Yor', 'Forger', '27', 'Female' ],
      [ 'Bond', 'Forger', '85', 'Male' ]
    ]
  });

  test("todo", async () => {
    // TODO: write proper tests
    try {
      expect(await parsePeopleCsv("people.csv")).to.deep.equal([]);
    } catch (e) {}
  });

  test("getCSVPeople returns a list of not normalized people from the people.csv", async () => {
    expect(await getCSVPeople("./test/people.csv")).to.be.an("array").and.not.be.empty;
  });

  test("getCSVPeople returns a list with the names of the csv", async () => {
    const results = await getCSVPeople("./test/people.csv");
    expect(results.every(list => Array.isArray(list) && list.length === 4)).to.be.true;
  });

  test("normalizePeoples return a correct list of people objects from a list of unformated people", () => {
    expect(normalizePeoples(peoples)).to.be.an("array").and.to.have.length(4);
  });

  test("normalizePeoples returns expected formatted objects", () => {
    const norPeoples = normalizePeoples(peoples);
    expect(norPeoples).to.deep.include({ name: "Loid", lastName: "Forger", gender: "Male" });
    expect(norPeoples).to.deep.include({ name: "Anya", lastName: "Forger", age: 6, gender: "Female" });
    expect(norPeoples).to.deep.include({ name: "Yor", lastName: "Forger", age: 27, gender: "Female" });
    expect(norPeoples).to.deep.include({ name: "Bond", lastName: "Forger", age: 85, gender: "Male" });
  });
});
