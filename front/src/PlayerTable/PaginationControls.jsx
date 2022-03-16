import { useCallback } from "react";

export function PaginationControls({
    useLimit,
    setUseLimit,
    limit,
    setLimit,
    lastPage,
    page,
    setPage,
}) {
    const limitOptions = [25, 50, 100, 200];

    const handleChangeUsePagination = useCallback(
        (e) => {
            setUseLimit(e.target.checked);
            setPage(0);
        },
        [setUseLimit]
    );

    const handleChangeLimit = useCallback(
        (e) => {
            setLimit(parseFloat(e.target.value));
            setPage(0);
        },
        [setLimit, setPage]
    );

    const handleChangePage = useCallback(
        (e) => {
            setPage(parseFloat(e.target.value));
        },
        [setPage]
    );

    // [0,1,2, ..., lastPage]
    const pageIndexes = Array.from(Array(lastPage).keys())

    return (
        <div className="pangination-controls__container">
            <div className="pagination-controls__use-pagination-box">
                <input
                    type="checkbox"
                    id="usePaginiationCheckbox"
                    checked={useLimit}
                    onChange={handleChangeUsePagination}
                />
                <label for="usePaginiationCheckbox">Use Pagination</label>
            </div>
            <div hidden={!useLimit} className="pagination-controls__extended-controls">
                <div className="pagination-controls__select-limit">
                    <label for="limitSelect">per page: </label><select id="limitSelect" onChange={handleChangeLimit}>
                        {limitOptions.map((val) => {
                            const selected = val === limit;
                            return <option value={val} selected={selected} >{val}</option>;
                        })}
                    </select>
                </div>
                <div className="pagination-controls__select-page">
                    <label for="pageSelect">page: </label><select id="pageSelect" onChange={handleChangePage}>
                        {pageIndexes.map((val) => {
                            const selected = val === page;
                            return <option value={val} selected={selected} >{val + 1}</option>;
                        })}
                    </select>
                </div>
            </div>
        </div>
    );
}
