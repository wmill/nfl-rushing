import Chance from "chance";
const chance = new Chance();

export interface PlayerStats {
    Player: string;
    Team: string;
    Pos: string;
    Att: number;
    "Att/G": number;
    Yds: number|string;
    Avg: number;
    "Yds/G": number;
    TD: number;
    Lng: string|number;
    "1st": number;
    "1st%": number;
    "20+": number;
    "40+": number;
    FUM: number;
}

export interface SortOption {
    id: string;
    desc: boolean;
}

export interface FilterOption {
    id: string;
    value: string;
}

export function parseDataValue(val) {
    const num = parseFloat(String(val).replace(',',''));
    if (isNaN(num)) {
        return val;
    } else {
        return num;
    }
};

export function sortByQueryOption(table, sortOptions: Array<SortOption>) {
    // TODO use more that first option
    if (!sortOptions) {
        return table;
    }
    const sortOption = sortOptions[0];
    let localTable = table.slice();
    if (sortOption && sortOption.id in validKeys) {
        localTable.sort((rowA, rowB) => {
            let a = parseDataValue(rowA[sortOption.id]);
            let b = parseDataValue(rowB[sortOption.id]);

            let returnVal;
            if (a < b) {
                returnVal = -1;
            } else if (a > b) {
                returnVal = 1;
            } else {
                returnVal = 0;
            }
            if (sortOption.desc) {
                returnVal *= -1;
            }
            return returnVal;
        });
    }
    return localTable;
}

export const keyOrder = [
    "Player",
    "Team",
    "Pos",
    "Att",
    "Att/G",
    "Yds",
    "Avg",
    "Yds/G",
    "TD",
    "Lng",
    "1st",
    "1st%",
    "20+",
    "40+",
    "FUM",
];

const validKeys = keyOrder.reduce((valid, key) => {
    valid[key] = true;
    return valid;
}, {});

export function dataToCsv(data: Array<PlayerStats>) {
    let csvData = keyOrder.join(",") + "\n";
    csvData = data.reduce((csv: string, player: PlayerStats) => {
        csv += keyOrder.map((key) => player[key]).join(",") + "\n";
        return csv;
    }, csvData);
    return csvData;
};

export function paginate(
    table: Array<PlayerStats>,
    page: number,
    limit: number
): Array<PlayerStats> {
    return table.slice(page * limit, page * limit + limit);
}


export function filterByQueryOption(
    table: Array<PlayerStats>,
    filterOptions: Array<FilterOption>
) {
    if (!filterOptions) {
        return table;
    }
    const result = table.filter((row) => {
        return filterOptions.every((filterOp) => {
            return (
                filterOp.id in validKeys &&
                row[filterOp.id]
                    .toLowerCase()
                    .indexOf(filterOp.value.toLowerCase()) !== -1
            );
        });
    });
    return result;
}


export function generateSampleData(size: number): Array<PlayerStats> {
    return new Array(size).fill(0).map(() => {
        return {
            Player: chance.name(),
            Team: chance.state({ territories: true }),
            Pos: chance.string({ length: 2 }),
            Att: chance.integer({ min: 0, max: 20 }),
            "Att/G": chance.floating({ min: 0, max: 20, fixed: 1 }),
            Yds: chance.integer({ min: 0, max: 200 }),
            Avg: chance.floating({ min: 0, max: 20, fixed: 1 }),
            "Yds/G": chance.floating({ min: 0, max: 200, fixed: 1 }),
            TD: chance.integer({ min: 0, max: 200 }),
            Lng: `${chance.integer({ min: 0, max: 100 })}${chance.weighted(
                ["", "T"],
                [5, 1]
            )}`,
            "1st": chance.integer({ min: 0, max: 10 }),
            "1st%": chance.floating({ min: 0, max: 50, fixed: 1 }),
            "20+": chance.integer({ min: 0, max: 20 }),
            "40+": chance.integer({ min: 0, max: 20 }),
            FUM: chance.integer({ min: 0, max: 20 }),
        };
    });
}
