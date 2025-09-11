import { Temporal } from "@js-temporal/polyfill";

export const daysUntilChristmasFixed = (date) => {
    if (!(date instanceof Temporal.PlainDate)) throw new Error("Expected a Temporal.PlainDate");
    let christmasDay = date.with({ month: 12, day: 25 });
    if (date.dayOfYear > christmasDay.dayOfYear) { christmasDay = christmasDay.add({ years: 1 }) };
    return date.until(christmasDay).days;
};