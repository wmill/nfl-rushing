import axios from "axios";
import buildURL from "axios/lib/helpers/buildURL";

const BASE_URL = "http://localhost:4000/";

const service = axios.create({
    baseURL: BASE_URL,
});

export function generateDownloadUrl(sort, sortDesc, playerFilter) {
    const sortBy = sort ? [{ id: sort, desc: sortDesc }] : null;
    const filterBy = playerFilter
        ? [{ id: "Player", value: playerFilter }]
        : null;

    const baseUrl = BASE_URL + "rushing/download";

    return buildURL(baseUrl, { sortBy, filterBy });
}

export function fetchPlayerData(
    sort,
    sortDesc,
    page,
    limit,
    playerFilter,
    useLimit
) {
    const sortBy = sort ? [{ id: sort, desc: sortDesc }] : null;
    const filterBy = playerFilter
        ? [{ id: "Player", value: playerFilter }]
        : null;
    return fetchPlayerDataFromServer(
        sortBy,
        page,
        useLimit ? limit : null,
        filterBy
    );
}

export function fetchPlayerDataFromServer(
    sortBy,
    pageIndex = 0,
    pageSize,
    filterBy
) {
    return service.get("rushing", {
        params: { sortBy, pageIndex, pageSize, filterBy },
    });
}
