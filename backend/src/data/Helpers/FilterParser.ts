import {Filter} from "../Dto/Filter";

export function getFilter(source: Filter){
    const page = Number.parseInt(source.page);
    const limit = Number.parseInt(source.limit);
    const offset = limit*page;
    return {
        "page": page,
        "limit": limit,
        "offset": offset
    };
}
