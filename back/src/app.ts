import express, { Request, Response } from "express";
import cors from "cors";

import playerData from './scoreData';

import {
    paginate,
    sortByQueryOption,
    dataToCsv,
    filterByQueryOption,
} from "./tableHelpers";

export const app = express();


app.use(cors());


const parseArrayQueryParam = (param) => {
    if (!Array.isArray(param)) {
        return undefined;
    }
    return param.map((val) => JSON.parse(val));
};

const getTableData = (request: Request) => {
    const filteredPlayerData = filterByQueryOption(
        playerData,
        parseArrayQueryParam(request.query.filterBy)
    );
    const sortedPlayerData = sortByQueryOption(
        filteredPlayerData,
        parseArrayQueryParam(request.query.sortBy)
    );
    const pageSize =
        parseFloat(String(request.query.pageSize)) || Number.MAX_SAFE_INTEGER;
    const pageIndex = parseFloat(String(request.query.pageIndex)) || 0;
    const data = paginate(sortedPlayerData, pageIndex, pageSize);
    const lastPage = Math.ceil(sortedPlayerData.length / pageSize);
    return {
        data,
        lastPage,
    };
};

const getRushing = (
    request: Request,
    response: Response,
) => {
    const { data, lastPage } = getTableData(request);
    response.status(200).json({ data, lastPage });
};

const downloadRushing = (
    request: Request,
    response: Response,
) => {
    const { data } = getTableData(request);
    const csvData = dataToCsv(data);
    response.status(200).attachment('rushingData.csv').send(csvData);
};

app.get("/rushing", getRushing);
app.get("/rushing/download", downloadRushing);
