import Chance from "chance";
const chance = new Chance();

import {
    paginate,
    generateSampleData,
    filterByQueryOption,
    parseDataValue,
    dataToCsv,
    keyOrder,
    sortByQueryOption,
} from "../src/tableHelpers";

describe("Paginate", () => {
    it("should not have an off by one error", () => {
        const records = generateSampleData(50);
        const page0 = paginate(records, 0, 10);

        expect(page0).toHaveLength(10);
        expect(page0[0]).toEqual(records[0]);
        expect(page0[9]).toEqual(records[9]);
        const page1 = paginate(records, 1, 10);

        expect(page1).toHaveLength(10);
        expect(page1[0]).toEqual(records[10]);
        expect(page1[9]).toEqual(records[19]);
    });
});

describe("FilterByQueryOption", () => {
    it("should do basic filtering", () => {
        const records = generateSampleData(50);
        let i: number;
        for (i = 10; i < 20; i++) {
            records[i].Player = `Mars New ${chance.name()}`;
        }
        const result = filterByQueryOption(records, [
            { id: "Player", value: "Mars " },
        ]);
        expect(result).toHaveLength(10);
    });
});

describe("parseDataValue", () => {
    it("should return an number in the basic cases", () => {
        let result = parseDataValue("120");
        expect(result).toBe(120);
        result = parseDataValue(12);
        expect(result).toBe(12);
    });

    it("should return a number if there is a T at the end", () => {
        const result = parseDataValue("120T");
        expect(result).toBe(120);
    });

    it("should return a number if passed a number", () => {
        const result = parseDataValue(120);
        expect(result).toBe(120);
    });

    it("should work with commas", () => {
        const result = parseDataValue("1,234");
        expect(result).toBe(1234);
    });
});

describe("dataToCsv", () => {
    it("should produce a csv file with correct headers", () => {
        const records = generateSampleData(5);
        const result = dataToCsv(records);
        const lines = result.split("\n");

        const headerColumns = lines[0].split(",");
        headerColumns.forEach((val, i) => {
            expect(headerColumns[i]).toBe(keyOrder[i]);
        });
    });

    it("should produce a csv file with correct data", () => {
        const RECORD_COUNT = 5;
        const records = generateSampleData(RECORD_COUNT);
        const result = dataToCsv(records);

        // skip header
        const lines = result.split("\n").slice(1);

        //empty due to \n on last line
        expect(lines.length).toBe(RECORD_COUNT + 1);
        expect(lines[RECORD_COUNT]).toBe("");

        for (let i = 0; i < RECORD_COUNT; i++) {
            let columns = lines[i].split(",");
        }
    });
});

describe("sortByQueryOption", () => {
    it("should sort oddball formats correctly", () => {
        const records = generateSampleData(5);
        records[0].Lng = 3;
        records[1].Lng = "2";
        records[2].Lng = "1T";
        records[3].Lng = "1,000T";
        records[4].Lng = 4;
        const result = sortByQueryOption(records, [{ id: "Lng", desc: false }]);
        expect(result[4].Lng).toBe("1,000T");
        expect(result[0].Lng).toBe("1T");
        expect(result[1].Lng).toBe("2");
    });
});
