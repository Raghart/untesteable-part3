import { readFile } from "node:fs/promises";
import { parse } from "csv-parse/sync";

// A function that reads and interact with a csv file is difficult to test and to read, part of it because breaks 
// one of the principles that a function should only do one thing, making it hard to test and maintain.
// With the name we can assume what the code is going to do, but it's hard to read when the records obtained from the
// csv are moved to a list of objects. Moving the logic into two separate functions would improve readability 
// and make easier tests.

export async function parsePeopleCsv(filePath) {
  const csvData = await readFile(filePath, { encoding: "utf8" });
  const records = parse(csvData, {
    skip_empty_lines: true,
    trim: true,
  });
  return records.map(([firstName, lastName, age, gender]) => {
    const person = {
      firstName,
      lastName,
      gender: gender.charAt(0).toLowerCase(),
    };
    if (age !== "") {
      person.age = parseInt(age);
    }
    return person;
  });
}
