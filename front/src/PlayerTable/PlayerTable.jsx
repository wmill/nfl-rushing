import React, { useState, useCallback, useEffect, useMemo } from "react";
import debounce from "lodash.debounce";
import { fetchPlayerData, generateDownloadUrl } from "./playerTableService";
import { PaginationControls } from "./PaginationControls";

export const keys = [
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

const sortKeys = {
    Yds: true,
    Lng: true,
    TD: true,
};

const TEXT_DEBOUNCE = 400;

export function PlayerTable() {
    const [data, setData] = useState([]);
    const [nameFilter, setNameFilter] = useState(null);
    const [sort, setSort] = useState(null);
    const [sortDesc, setSortDesc] = useState(false);
    const [loading, setLoading] = useState(false);

    const [useLimit, setUseLimit] = useState(false);

    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(200);
    const [lastPage, setLastPage] = useState(0);

    const cycleSort = useCallback(
        (newKey) => (e) => {
            if (newKey === sort) {
                if (!sortDesc) {
                    setSortDesc(true);
                } else {
                    // clear sort
                    setSortDesc(false);
                    setSort(null);
                }
            } else {
                setSort(newKey);
                setSortDesc(false);
            }
        },
        [sort, sortDesc]
    );

    const changeFilter = (event) => {
        setNameFilter(event.target.value);
    };

    // no need to reload for every character
    const debouncedChangeFilter = useMemo(
        () => debounce(changeFilter, TEXT_DEBOUNCE),
        []
    );

    // load data when state changes
    useEffect(() => {
        setLoading(true);
        fetchPlayerData(sort, sortDesc, page, limit, nameFilter, useLimit)
            .then((resp) => {
                setData(resp.data.data);
                setLastPage(resp.data.lastPage);
            })
            .finally(() => setLoading(false));
    }, [nameFilter, sort, sortDesc, page, limit, useLimit]);

    const downloadUrl = generateDownloadUrl(sort, sortDesc, nameFilter);

    return (
        <div className="player-table__contianer">
            <div className="player-table__controls">
                <div className="player-table__download-link-wrapper">
                    <a href={downloadUrl}>Download</a>{" "}
                    {loading && (
                        <span className="player-table__loading">
                            Loading...
                        </span>
                    )}
                </div>
                <div className="player-table__search-wrapper">
                    <input
                        className="player-table__input"
                        onChange={debouncedChangeFilter}
                        type="text"
                        placeholder="Filter by name..."
                    />
                </div>
                <PaginationControls {...{useLimit, setUseLimit, limit, setLimit, lastPage, page, setPage}}/>
            </div>
            <div className="player-table__table-wrapper">
                <table className="player-table__table">
                    <tr>
                        {keys.map((key) => {
                            if (key in sortKeys) {
                                return (
                                    <th
                                        className="player-table__td-clickable"
                                        key={key}
                                        onClick={cycleSort(key)}
                                    >
                                        {key}
                                        {sort === key
                                            ? sortDesc
                                                ? " 🔽"
                                                : " 🔼"
                                            : ""}
                                    </th>
                                );
                            }
                            return (
                                <th className="player-table__th-td" key={key}>
                                    {key}
                                </th>
                            );
                        })}
                    </tr>
                    {data.map((row, i) => {
                        return (
                            <tr key={i} className="player-table__data-row">
                                {keys.map((key) => {
                                    return <td key={key}>{row[key]}</td>;
                                })}
                            </tr>
                        );
                    })}
                </table>
            </div>
        </div>
    );
}
