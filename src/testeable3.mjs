import { parse } from "csv-parse/sync";
import { readFile } from "node:fs/promises";

export const getCSVPeople = async (filePath) => {
    const csvData = await readFile(filePath, { encoding: "utf-8" });
    return parse(csvData, { skip_empty_lines: true, trim: true }).slice(1);
};

export const normalizePeoples = (peoples) => {
    return peoples.map(([name, lastName, age, gender]) => {
        const people = { name, lastName, gender };
        if (age !== "") people.age = parseInt(age);
        return people;
    });
};